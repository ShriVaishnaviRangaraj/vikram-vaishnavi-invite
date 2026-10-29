# Art direction

Locked in "Lock the art direction: couple key still, palette and type"
([#4](https://github.com/bontaramsonta/vikram-vaishnavi-invite/issues/4)).
Every generated asset matches this sheet.

## Couple key still

| File | Use |
|---|---|
| `docs/art-direction/couple-key.png` | Master, 1536×2720. The identity reference for every later Higgsfield job. |
| `public/assets/couple-key.webp` | Web copy, 1080×1913, ~230 KB. |
| `docs/art-direction/couple-ref-crop.png` | The couple cropped from `docs/reference/invite.webp` (540×1140 at +484+396). Input to the key still. |

- **Model:** Seedream 5.0 Pro (`seedream_v5_pro`)
- **Params:** `--aspect_ratio 9:16 --resolution 2k`
- **Seed:** 392523. The CLI exposes no seed flag, so a rerun will not reproduce it. Reuse the master instead.
- **Job:** `38fbbfa9-2117-4772-a0d9-64100cece148`
- **References, in order:** `couple-ref-crop.png`, then `docs/reference/invite.webp` (as PNG)

Prompt:

```text
Soft watercolour wedding illustration of the same South Indian couple shown in the reference images, keeping their faces, hair, build and outfits identical. Full-length portrait, both standing, turned toward each other in three-quarter view, gazing at each other with gentle smiles, holding hands at waist height. He: short wavy black hair, trimmed beard, cream long-sleeve shirt with sleeves rolled, cream veshti with a broad gold border. She: long wavy black hair in a loose side braid with a cluster of white jasmine flowers, gold jhumka earrings, gold necklace, gold waist belt, gold bangles, a rose-pink and gold Kanchipuram silk saree with woven gold motifs. Hand-painted storybook style matching the reference: delicate pencil linework, warm translucent washes, soft diffused light, subtle paper texture. Plain warm ivory background with a faint soft vignette, nothing else in the frame. No text, no flowers, no lanterns, no border, no frame.
```

Command:

```bash
higgsfield generate create seedream_v5_pro --prompt "$(cat prompt.txt)" \
  --image docs/art-direction/couple-ref-crop.png --image invite.png \
  --aspect_ratio 9:16 --resolution 2k --wait
```

### Matching it in later assets

- Pass `couple-key.png` as the **first** image reference whenever the couple appears.
- Reuse the style clause: *"Hand-painted storybook style: delicate pencil linework, warm translucent washes, soft diffused light, subtle paper texture."*
- Edges SHOULD bleed into ivory rather than end in a hard cut, as the key still does.
- Seedream 5.0 Pro was also tried against Nano Banana 2 and GPT Image 2.5 on the same prompt. It won on the loose, fading watercolour.

## Palette

| Token | Hex | Use |
|---|---|---|
| `--ivory` | `#FAF0DE` | Page base |
| `--cream` | `#F3E4C8` | Cards, surfaces |
| `--gold` | `#C69951` | Rules, borders, ornaments, buttons on maroon. Not for text on ivory. |
| `--gold-deep` | `#8A6328` | Serif caps and small gold text on ivory. 4.8:1 on ivory, 4.2:1 on cream. |
| `--rose-taupe` | `#8C5A5E` | Script names and headings |
| `--maroon` | `#5C1A26` | Reception section background |
| `--ink` | `#4A3A33` | Body text |

Sampled from the printed invite's ornaments, date and script text. The script colour is pulled toward the reel's rose-taupe.

Gold buttons MUST carry maroon text (5:1). Ivory on gold is only 2.3:1.

## Type

All Google Fonts.

| Role | Family |
|---|---|
| Script (names, headings) | Great Vibes |
| Serif caps (labels, dates) | Cinzel 400/500, letter-spacing ~0.2em |
| Italic serif (body) | Cormorant Garamond Italic, with 400/500 roman |

```html
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500&family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&family=Great+Vibes&display=swap" rel="stylesheet">
```

## Gate door

From "Generate the gate door, split into swingable halves"
([#6](https://github.com/bontaramsonta/vikram-vaishnavi-invite/issues/6)).

The gate is a video. Splitting the still into two 3D-rotated halves made the elephants swing with the doors and look flat. In the clip the elephants raise their trunks, the doors open inward behind them, and the camera pushes through the doorway into ivory mist. The hero fades in out of that mist (`src/hero.js`).

| File | Use |
|---|---|
| `docs/art-direction/gate-door.png` | Closed-door still, 1536×2720. The video's start frame. |
| `docs/art-direction/gate-open-master.mp4` | Video as generated, 720×1276, 5 s, 6.4 MB |
| `docs/art-direction/gate-mist-end.jpg` | End frame passed to the video, a flat ivory radial gradient |
| `public/assets/gate-open.mp4` | Web copy, sped up 1.7× to about 3 s to match the reference gate: `-vf "setpts=PTS/1.7,fps=24"`, H.264 High, CRF 25, no audio, faststart, ~720 KB |
| `public/assets/gate-poster.webp` | The video's first frame, used as the poster and preloaded |

### Still

- **Model:** Seedream 5.0 Pro (`seedream_v5_pro`), `--aspect_ratio 9:16 --resolution 2k`
- **Seed:** 776325
- **Job:** `e3cc3026-75fb-4131-8630-e1b3c802dd5d`
- **Reference:** `couple-key.png`, for style only

### Video

- **Model:** Kling 3.0 (`kling3_0`), `--mode std --duration 5 --aspect_ratio 9:16 --sound off`, `--start-image gate-door.png --end-image gate-mist-end.jpg`
- **Job:** `ad1b7610-96ae-4528-8dba-72c33e9856e6`. No seed is returned.
- Without the end frame the clip stops with the door edges still in view.
- The Basic plan rejects Seedance 2.5 and Kling `--mode pro` ("Pro or Ultimate plan required"). Kling `std` works.

```text
Slow, smooth camera dolly forward toward the centre of the doorway. The two carved teak door leaves swing open inward, away from the viewer, hinged at their outer edges. The two elephants stand perfectly still like temple statues, mouths closed, and in one calm, graceful motion both raise their trunks straight up in salute and hold them there; no other elephant movement, no head turning, no open mouths, no ear flapping. As the doors part, soft warm white light and dense ivory mist pour out through the doorway. The camera keeps moving forward through the open doorway into the mist, the elephants and the door frame sliding out past the edges of the frame, until the whole frame is soft, even ivory-white mist with nothing else visible. Hand-painted watercolour storybook style, matching the first frame exactly.
```

Still prompt:

```text
Front view, perfectly symmetrical composition: a tall, ornately carved dark teak South Indian temple door, closed, its two door leaves meeting in a straight vertical seam exactly at the horizontal centre of the image. Each leaf has carved square panels with lotus motifs and rows of brass bosses. Above the doorway hangs a toran of fresh mango and banana leaves with strings of orange and yellow marigolds and white jasmine. Tall banana plants frame both sides of the doorway, with brass oil lamps on the floor. Two richly caparisoned temple elephants with gold nettipattam face plates and marigold garlands stand in front of the door, one on the left leaf and one on the right leaf, mirror images of each other, facing the centre with trunks curled up in greeting; neither elephant crosses the centre line, which stays clear. Hand-painted storybook style matching the reference image: delicate pencil linework, warm translucent watercolour washes, soft diffused light, subtle paper texture. Warm ivory, muted gold, rose and teak palette. The painting fills the frame edge to edge. No people, no text, no border, no frame.
```

## Hero loop

From "Generate the hero loop video"
([#7](https://github.com/bontaramsonta/vikram-vaishnavi-invite/issues/7)).

Two stacked loops. **A**, the couple facing each other before the gopuram, plays one full pass as the hero fades in out of the gate mist. On A's wrap, **B**, the couple side by side under a flower shower, crossfades in over 1.5 s and keeps looping (`src/hero.js`). Reduced motion shows A's poster as a still.

| File | Use |
|---|---|
| `docs/art-direction/hero-a-still.png` | A's start and end frame, 1536×2720 |
| `docs/art-direction/hero-a-master.mp4` | A as generated, 720×1276, 7 s |
| `docs/art-direction/hero-b-still.png` | B without petals, 1536×2720. Input to the petal still. |
| `docs/art-direction/hero-b-petals-still.png` | B's start and end frame, 1536×2720 |
| `docs/art-direction/hero-b-master.mp4` | B as generated, 720×1276, 7 s |
| `public/assets/hero-a.mp4` · `hero-a-poster.webp` | Web copy, 6.04 s, ~490 KB · its first frame, ~26 KB. The poster is also the desktop backdrop. |
| `public/assets/hero-b.mp4` · `hero-b-poster.webp` | Web copy, 6.04 s, ~1.15 MB · its first frame, ~40 KB |

### Generation

| Asset | Model | Settings | Job | Seed |
|---|---|---|---|---|
| `hero-a-still.png` | `seedream_v5_pro` | 9:16, 2k, `couple-key.png` as the only reference | `827b7f46-9779-4748-af43-4ff54812df1b` | 434132 |
| `hero-b-still.png` | `seedream_v5_pro` | 9:16, 2k, `couple-key.png` as the only reference | `5393658c-949d-4f41-a7d6-0ecb181acc13` | 835715 |
| `hero-b-petals-still.png` | `seedream_v5_pro` | 9:16, 2k, references `hero-b-still.png` then `couple-key.png` | `35141f7d-b365-4f30-9c55-22bcb8bdafd4` | 867069 |
| `hero-a-master.mp4` | `kling3_0` | `--mode std --duration 7 --aspect_ratio 9:16 --sound off`, start and end `hero-a-still.png` | `3b1721b1-de12-43db-8a34-17c61b872f22` | not returned |
| `hero-b-master.mp4` | `kling3_0` | same, start and end `hero-b-petals-still.png` | `779ae1ba-4a2b-4ee0-bb16-3ae9ab605deb` | not returned |

The same start and end frame makes Kling land back where it began. The B prompt asks for a steady rain, but Kling made it a toss: a handful of petals bursts from the top, showers the couple and clears, once per loop.

### Transcode

Each master is cut to a seamless loop: frames 24–168, with the last second crossfaded into frames 0–23, so the wrap is a single source-frame step. The same pass scales to 720×1280 and blends in 30% ivory (`#FAF0DE`) for haze.

```bash
HAZE="lutrgb=r='val*0.7+250*0.3':g='val*0.7+240*0.3':b='val*0.7+222*0.3'"
LOOP="[0:v]split[m][h];[m]trim=start_frame=24,setpts=PTS-STARTPTS[main];[h]trim=end_frame=24,setpts=PTS-STARTPTS[head];[main][head]xfade=transition=fade:duration=1:offset=5.0417,scale=720:1280,setsar=1,$HAZE,format=yuv420p[v]"
ENC="-an -c:v libx264 -preset slow -crf 20 -profile:v high -pix_fmt yuv420p -movflags +faststart"

ffmpeg -i hero-a-master.mp4 -filter_complex "$LOOP" -map "[v]" $ENC hero-a.mp4

# B is rotated by 60 frames so it fades in on the calm stretch and the toss lands ~3 s later.
ffmpeg -i hero-b-master.mp4 -filter_complex "$LOOP" -map "[v]" -c:v libx264 -crf 0 loop-b.mkv
ffmpeg -i loop-b.mkv -filter_complex "[0:v]split[x][y];[x]trim=start_frame=60,setpts=PTS-STARTPTS[late];[y]trim=end_frame=60,setpts=PTS-STARTPTS[early];[late][early]concat=n=2:v=1[v]" -map "[v]" $ENC hero-b.mp4

# Posters: the first frame of each loop.
ffmpeg -i hero-a.mp4 -frames:v 1 a.png && cwebp -q 80 a.png -o hero-a-poster.webp
```

Still A prompt:

```text
Soft watercolour wedding illustration of the same South Indian couple shown in the reference image, keeping their faces, hair, build and outfits identical. They stand together in the upper half of the frame, seen from the knees up, turned toward each other in three-quarter view, holding hands, gazing at each other with gentle smiles. Behind them, far in the distance, a tall South Indian temple gopuram rises through soft morning mist, pale and faint. Tall banana plants with broad leaves frame both sides, softly painted. Hazy, washed-out, very light and airy: low contrast, pastel ivory and muted gold tones, as if seen through warm morning mist. The lower forty percent of the image dissolves into plain warm ivory mist with nothing in it, and the top and outer edges also bleed softly into ivory. Hand-painted storybook style: delicate pencil linework, warm translucent washes, soft diffused light, subtle paper texture. No text, no border, no frame.
```

Still B prompt:

```text
Soft watercolour wedding illustration of the same South Indian couple shown in the reference image, keeping their faces, hair, build and outfits identical. They walk slowly side by side toward the viewer in the upper half of the frame, seen from the knees up, holding hands, she leaning her head slightly toward his shoulder, both smiling softly. Behind them a temple courtyard path leads back to a tall South Indian temple gopuram, pale and faint in soft morning mist. Tall banana plants with broad leaves and a few hanging marigold garlands line both sides. Hazy, washed-out, very light and airy: low contrast, pastel ivory and muted gold tones, as if seen through warm morning mist. The lower forty percent of the image dissolves into plain warm ivory mist with nothing in it, and the top and outer edges also bleed softly into ivory. Hand-painted storybook style: delicate pencil linework, warm translucent washes, soft diffused light, subtle paper texture. No text, no border, no frame.
```

Petal still prompt:

```text
Keep the first reference image exactly as it is: the same couple, the same pose, faces, outfits, temple path, gopuram, banana plants, framing and soft hazy watercolour look. Add only a gentle shower of flower petals falling from the top of the frame around and over the couple: loose rose-pink and crimson rose petals, orange and yellow marigold petals and small white jasmine blossoms, scattered sparsely through the upper two thirds of the image, at different depths, a few drifting past their shoulders and some landing in her hair, as if guests just out of view are showering them with flowers. The petals are painted in the same loose watercolour as the rest, soft and slightly translucent, not sharp. The lower forty percent stays plain warm ivory mist. Hand-painted storybook style: delicate pencil linework, warm translucent washes, soft diffused light, subtle paper texture. No text, no border, no frame.
```

Loop A prompt:

```text
Locked-off camera, no camera movement, no zoom. A calm, gentle living-painting loop. A soft warm breeze moves through the scene: the broad banana leaves on both sides sway slowly, the loose end of her silk saree and the jasmine in her hair stir lightly, and thin wisps of ivory morning mist drift slowly sideways across the gopuram and the ground. The couple stay standing in place holding hands; they breathe softly, she smiles and tilts her head very slightly toward him, he leans a touch closer, then both settle back into exactly the pose of the first frame. Subtle, slow, dreamy motion only; no walking, no turning around, no new objects or people. Hand-painted watercolour storybook style, matching the first frame exactly, staying hazy and washed out.
```

Loop B prompt:

```text
Locked-off camera, no camera movement, no zoom. A calm, gentle living-painting loop of a flower shower. Throughout the whole clip, a steady, continuous rain of rose, marigold and jasmine petals falls slowly from the top of the frame, fluttering and tumbling down past the couple and drifting out of view, with new petals constantly entering from the top edge, as if guests just out of view are showering the couple with flowers. A soft breeze sways the banana leaves and marigold garlands and stirs the loose end of her saree; thin ivory mist drifts across the temple path. The couple stay in place holding hands; she nestles her head against his shoulder and smiles, he glances down at her warmly, both delighted by the petals, then they settle back into exactly the pose of the first frame. Subtle, slow, dreamy motion; they do not walk forward, no new people visible, no camera shake. Hand-painted watercolour storybook style, matching the first frame exactly, staying hazy and washed out.
```

## Stills: divine scene, temple corridor, gopuram

From "Generate the stills: divine scene, temple corridor, gopuram"
([#8](https://github.com/bontaramsonta/vikram-vaishnavi-invite/issues/8)).

All three stills use Seedream 5.0 Pro (`seedream_v5_pro`, `--resolution 2k`) with `couple-key.png` as the only reference, for style. Each still had two candidates, A and B; Sourav picked divine A, corridor A and gopuram B. The corridor then became a looping video.

| File | Use |
|---|---|
| `docs/art-direction/divine.png` | Divine scene master, 1760×2352 (3:4) |
| `public/assets/divine.webp` | Web copy, 1080×1443, ~115 KB. CSS feathers the top and bottom 12%. |
| `docs/art-direction/corridor.png` | Corridor master, 1536×2720 (9:16). The video's first and last frame. |
| `docs/art-direction/corridor-loop-master.mp4` | Video as generated, 720×1280, 10 s, 9.2 MB, with an audio track the site does not use |
| `public/assets/corridor-loop.mp4` | Web loop, 6.5 s, ~1.7 MB, no audio. CSS feathers it into the bridge's ink background. |
| `public/assets/corridor-poster.webp` | The loop's first frame, used as the poster |
| `docs/art-direction/gopuram.png` | Gopuram master, 1536×2720 (9:16) |
| `public/assets/gopuram.webp` | Web copy, 1080×1913, ~40 KB. A `multiply` layer behind the RSVP form, so its paper white becomes the page ivory, with a mask that feathers the top. |

| Still | Aspect | Seed | Job |
|---|---|---|---|
| Divine scene | 3:4 | 802228 | `d85a97db-9b54-401f-b572-71b8be944323` |
| Temple corridor | 9:16 | 708101 | `052f4887-eaf5-49f4-aa73-600991dcebc2` |
| Gopuram | 9:16 | 360467 | `39eb3f2a-2901-4a51-a64f-f41aa5a0dadf` |

Divine scene prompt:

```text
Eye-level still life of a South Indian puja altar, centred and symmetrical. Two tall brass kuthuvilakku oil lamps with five lit wicks stand on either side. Between them a wide brass urli bowl of water floats white jasmine flowers and two open pink lotus blossoms. Small clay diyas and candles glow in front, with scattered rose petals and a few marigolds on a cream cloth. Warm golden candlelight. Hand-painted storybook style matching the reference image: delicate pencil linework, warm translucent watercolour washes, soft diffused light, subtle paper texture. Warm ivory, muted gold, rose and brass palette. The top and bottom of the painting fade softly into plain warm ivory paper, no hard edges. No people, no text, no border, no frame.
```

Temple corridor prompt:

```text
Looking straight down the centre of a long South Indian temple mandapam corridor at dusk. Rows of carved granite pillars with yali and lotus capitals line both sides and recede to a vanishing point. Strings of orange marigold and white jasmine garlands swag between the pillars. Brass oil lamps glow along the stone floor, and warm amber light fills the far end. Dark, warm and quiet: deep umber and maroon shadows with gold highlights. The centre of the frame is open, calm and uncluttered, leaving room for a line of text. Hand-painted storybook style matching the reference image: delicate pencil linework, warm translucent watercolour washes, soft diffused light, subtle paper texture. The top and bottom edges fade softly into deep warm brown shadow. No people, no text, no border, no frame.
```

Gopuram prompt:

```text
A faint South Indian temple gopuram tower seen from a distance, centred in the lower half of the frame, its base hidden in soft morning mist, a few coconut palms faint on either side. The tower is a pale silhouette of carved tiers in thin pencil lines and the lightest cream and gold watercolour washes, almost fading into the paper. The upper half is empty pale ivory sky. Very low contrast, washed out, like a watermark: nothing darker than light tan. Hand-painted storybook style matching the reference image: delicate pencil linework, warm translucent watercolour washes, soft diffused light, subtle paper texture. Everything fades into plain warm ivory paper at the edges. No people, no text, no border, no frame.
```

Auditorium (the venue screen's backdrop): painted outside the project and supplied by the couple.

| File | Use |
|---|---|
| `docs/art-direction/auditorium.png` | Master as supplied, 1333×1180 |
| `public/assets/auditorium.webp` | Web copy, 1080×956, ~47 KB. Its cream paper is divided out to white and every edge feathered to white, so the `multiply` layer behind the venue blends into the page ivory with no seam. |

### Corridor loop

An endless walk forward through the pillars, as in the reference reel's bridge.

- **Model:** Gemini Omni 1.1 Flash (`gemini-omni-1.1-flash`) through the Gemini API's Interactions endpoint, `POST /v1beta/interactions`, with `response_format: {type: "video", aspect_ratio: "9:16", resolution: "720p"}`.
- **Input:** `corridor.png`, as a 1080×1920 JPEG, passed twice: once as the first frame and once as the last. The camera advances exactly one bay of pillars, so the last frame lands on the first.
- **Interaction:** `v1_ChdmU25mYXMtREI0SG42OTRQdGRQQjRRWRIXZlNuZmFzLURCNEhuNjk0UHRkUEI0UVk`. No seed is returned.
- The model eases in and out: the camera starts near rest and peaks mid-clip. The web copy is retimed to a constant camera speed:
  1. Measure per-frame camera speed as the median Farneback optical-flow magnitude (OpenCV).
  2. Interpolate the clip to 96 fps with `minterpolate=fps=96:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1`.
  3. Pick 156 frames at equal steps of cumulative camera progress, dropping the last frame because it repeats the first.
  4. Encode at 24 fps with H.264 High, CRF 26, no audio and faststart.
- The result: camera speed holds at 1.25 ± 0.13 px per frame, and the loop seam steps the same 1.24 as any other frame. Before the retime it ranged from 0.13 to 1.38.
- Kling 3.0 `std` with the still as both start and end frame stayed almost static, with under 0.3% of pixels moving, whatever the prompt.

```text
The first image is the first frame and the second image is the last frame of the video; they are identical, so the clip must loop seamlessly. The camera glides forward at a slow, perfectly constant speed straight down the centre of this temple corridor, eye level, with no tilt, no pan and no rotation. Over the whole clip it travels exactly one bay: the nearest pair of carved pillars and their brass lamps pass out of the frame at the left and right edges, while the next pair of pillars ahead grows to take exactly their place, so the final frame lines up perfectly with the first. Endless walk through the pillars. The oil-lamp flames flicker gently and the garlands sway slightly. Keep the hand-painted watercolour storybook style, the warm light and the architecture of the image exactly. No people, no text.
```

## Wedding journey pictures

The journey section shows the three events one after another. Each is a large 3:4 portrait picture on a cream mount in a gold double frame, over its day, name and time. A picture not yet made shows as a plain framed mount (`.event-photo.placeholder` in `index.html`).

| File | Event | Picture |
|---|---|---|
| `public/assets/journey-nalangu.webp` | Nalangu, Thu 19 Nov, 6:00 PM | Family shower the seated couple with turmeric |
| `public/assets/journey-reception.webp` | Reception, Thu 19 Nov, 7:30 PM | The couple at the evening reception, in lehenga and suit |
| `public/assets/journey-muhurtham.webp` | Muhurtham, Fri 20 Nov, 6:15 AM | The couple exchange varamala; shirt and panchakacham, gold saree with a red border |

- **Generate:** 3:4 portrait, at least 1086×1448, with `couple-key.png` as the first reference and one of the finished journey pictures as the second, for a matching style: warm, richly coloured watercolour with painted edges, the couple large and central.
- **Shown at:** about 86% of the column, so up to about 340×450 CSS px.
- **Web copy:** 900×1200 WebP at quality 0.72, about 150 KB each, made in headless Edge (canvas `toDataURL('image/webp')`) as no image tools are installed.
