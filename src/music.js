// Web Audio, not <audio>: iOS ignores an element's volume, so fades need gain nodes, and a
// decoded buffer loops without the codec gap an element leaves at the seam.
const FADE_IN = 1.5
const FADE_OUT = 0.4
const VOLUME = 1
// How loud the song stays under the couple's spoken message, and how fast it dips and returns.
const DUCKED = 0.15
const DUCK_FADE = 0.6

// One song loops through the whole invitation from the gate tap: all of it, or only the lines from
// `from` to `to` seconds when they are given. `setPlaying` is the music button; `duck` dips the
// song under the couple's message and brings it back, on its own gain so the two never clash.
export function createMusic({ url, from = 0, to }) {
  const ctx = new (window.AudioContext || window.webkitAudioContext)()
  const ramp = (param, value, seconds) => {
    const now = ctx.currentTime
    param.cancelScheduledValues(now)
    param.setValueAtTime(param.value, now)
    param.linearRampToValueAtTime(value, now + seconds)
  }
  const master = ctx.createGain()
  master.gain.value = 0
  const ducking = ctx.createGain()
  master.connect(ducking).connect(ctx.destination)

  const buffer = fetch(url)
    .then((res) => res.arrayBuffer())
    .then((data) => ctx.decodeAudioData(data))

  let started = false
  let playing = false
  let suspendTimer

  async function startSong() {
    const source = ctx.createBufferSource()
    source.buffer = await buffer
    source.loop = true
    if (to) {
      source.loopStart = from
      source.loopEnd = to
    }
    source.connect(master)
    source.start(ctx.currentTime + 0.05, from)
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) ctx.suspend()
    else if (playing) ctx.resume()
  })

  const duck = (on) => ramp(ducking.gain, on ? DUCKED : 1, DUCK_FADE)

  // MUST first run inside a user gesture: that is what lets iOS start the context.
  function setPlaying(on) {
    playing = on
    clearTimeout(suspendTimer)
    if (!on) {
      ramp(master.gain, 0, FADE_OUT)
      suspendTimer = setTimeout(() => ctx.suspend(), FADE_OUT * 1000)
      return
    }
    // Plays through the iPhone's silent switch, like a video would (Safari 17+).
    if (navigator.audioSession) navigator.audioSession.type = 'playback'
    ctx.resume()
    if (!started) {
      started = true
      startSong().then(() => playing && ramp(master.gain, VOLUME, FADE_IN))
    } else {
      ramp(master.gain, VOLUME, FADE_IN)
    }
  }

  return { setPlaying, duck }
}
