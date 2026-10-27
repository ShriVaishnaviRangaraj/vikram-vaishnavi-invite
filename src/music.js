import { onScroll } from 'animejs'

// Web Audio, not <audio>: iOS ignores an element's volume, so fades need gain nodes, and a
// decoded buffer loops without the codec gap an element leaves at the seam.
const FADE_IN = 1.5
const FADE_OUT = 0.4
const CROSSFADE = 2.5
// Silent on the local dev server; preview and production builds play at full volume.
const VOLUME = import.meta.env.DEV ? 0 : 1

// Two looping beds play in sync from the gate tap; scrolling past the hero crossfades between them.
export function createMusic({ heroUrl, journeyUrl, hero }) {
  const ctx = new (window.AudioContext || window.webkitAudioContext)()
  const ramp = (param, value, seconds) => {
    const now = ctx.currentTime
    param.cancelScheduledValues(now)
    param.setValueAtTime(param.value, now)
    param.linearRampToValueAtTime(value, now + seconds)
  }
  const master = ctx.createGain()
  master.gain.value = 0
  master.connect(ctx.destination)

  const beds = [heroUrl, journeyUrl].map((url, i) => {
    const gain = ctx.createGain()
    gain.gain.value = i === 0 ? 1 : 0
    gain.connect(master)
    const buffer = fetch(url)
      .then((res) => res.arrayBuffer())
      .then((data) => ctx.decodeAudioData(data))
    return { gain, buffer }
  })
  const ready = Promise.all(beds.map((bed) => bed.buffer))

  let started = false
  let playing = false
  let suspendTimer

  async function startBeds() {
    const buffers = await ready
    const at = ctx.currentTime + 0.05
    beds.forEach((bed, i) => {
      const source = ctx.createBufferSource()
      source.buffer = buffers[i]
      source.loop = true
      source.connect(bed.gain)
      source.start(at)
    })
  }

  function crossfadeTo(index) {
    beds.forEach((bed, i) => ramp(bed.gain.gain, i === index ? 1 : 0, CROSSFADE))
  }

  onScroll({
    target: hero,
    leave: 'center bottom',
    onLeaveForward: () => crossfadeTo(1),
    onEnterBackward: () => crossfadeTo(0),
  })

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) ctx.suspend()
    else if (playing) ctx.resume()
  })

  // MUST first run inside a user gesture: that is what lets iOS start the context.
  return function setPlaying(on) {
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
      startBeds().then(() => playing && ramp(master.gain, VOLUME, FADE_IN))
    } else {
      ramp(master.gain, VOLUME, FADE_IN)
    }
  }
}
