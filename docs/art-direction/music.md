# Music

From "Generate the music loop"
([#9](https://github.com/bontaramsonta/vikram-vaishnavi-invite/issues/9)).

One song plays through the whole invitation, from the gate tap (`src/music.js`). It repeats a span of lines the couple chose, by ear, from "Seetha Kalyana Vaibhogame". The top-right button fades it out and suspends the audio context, then resumes and fades back in. The gate clip has no audio of its own.

| File | Use |
|---|---|
| `public/assets/music.mp3` | The whole invitation: 0:51.0 to 2:01.6 of the song (70.6 s), MP3 128 kbps stereo, ~1.1 MB |

## The song

- **Source:** "Seetha Kalyana Vaibhogame - NaaSongsHD.mp3" (10:11, 128 kbps), not checked in. It is a commercial recording, used at the couple's choice, accepting the rights risk. If it is ever claimed, replace it.
- **Rejected:** "Walk of the Bride, Seetha Kalyana Vaibhogame" by Agam, from 5:32.5.

The lines were cut without re-encoding: an MP3 is a run of independent 26 ms frames, so the cut copies the frames from one second before the start to half a second after the end. `main.js` sets the loop points inside that margin, at 0.9755 s and 71.5755 s of the file, so the playback starts and wraps on the chosen lines and never plays the margins, which can start with a decoding glitch.

## Earlier music (replaced)

Before the couple chose their song, two loops played in sync from the gate tap. The reel's own track sat under the hero, then crossfaded over 2.5 s into a generated veena and bansuri loop once the hero's bottom edge passed the middle of the screen. Neither file is in the project any more; the notes below are kept for reference.

### Hero bed: the reference reel's audio

Taken from the reference reel (`~/Downloads/WhatsApp Video 2026-10-25 at 16.55.48.mp4`, not checked in): `ffmpeg -i <reel> -vn -c:a copy reel.m4a`. It is not generated. It is probably a licensed track, and Sourav chose to use it, accepting the rights risk. If it is ever claimed, replace it with a generated bed.

### Journey bed: veena and bansuri

- **Model:** Sonilo Music (`sonilo_music`), `--duration 48`
- **Job:** `9e998903-180d-41cf-a879-ba3465a88002`

```text
Warm instrumental for an elegant South Indian wedding invitation. Veena melody answered by a soft bansuri flute, over a tanpura drone, with light tabla and finger cymbals. Peaceful, joyful, golden-hour mood, gentle and unhurried, no vocals. Consistent tempo and instrumentation throughout so it loops seamlessly.
```

### Loop cut

`scripts/loopcut.py` searches for the start and end points whose next 4 s sound most alike (onset envelope plus log spectrum). It writes the span between them with its first 1.5 s equal-power crossfaded from the audio just after the end point, so playback wraps without a seam.

```sh
uv run --with numpy python scripts/loopcut.py reel.m4a reel-loop.wav 0.8 3 30 44 1.5   # a=0.789 b=32.299
uv run --with numpy python scripts/loopcut.py veena-bansuri.m4a c-loop.wav 0.2 3 28 40 1.5   # a=2.984 b=39.126
ffmpeg -i reel-loop.wav -c:a aac -b:a 64k -movflags +faststart music-hero.m4a
ffmpeg -i c-loop.wav -c:a aac -b:a 96k -movflags +faststart music-journey.m4a
```

The loops play through Web Audio, not `<audio>`. iOS ignores an element's `volume`, so fades need gain nodes. A decoded buffer also loops without the gap a codec leaves at the seam: Chrome decodes both files to exactly the cut length, with the AAC priming trimmed. `navigator.audioSession.type = 'playback'` (Safari 17+) keeps the music playing with the iPhone's silent switch on.

### Rejected candidates

- Sonilo veena in Mohanam with mridangam (`562756e9-…`), and Sonilo nadaswaram with thavil (`505aea93-…`).
- Seed Audio 1.0 with the reel as `--audio-references` (`4df1b41f-…`, `d8a42f72-…`): new takes in the reel's style. A prompt asking for a "re-recording" of the reference failed every time. Seed Audio returns 23–30 s and ignores a requested length.
