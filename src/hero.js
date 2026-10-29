import { animate, stagger, utils } from 'animejs'

const FADE = 1.5
// B's loop opens mid-shower, with petals already over the couple. By 2.5 s they have all fallen
// and the sky is clear; the next toss comes in from the top about half a second later.
const SHOWER_START = 2.5
// The petals fall in slight slow motion.
const SHOWER_SPEED = 0.8

// A plays once and holds its last frame. B (the flower shower) fades in over A's last 1.5 s while
// paused on its clear-sky frame, then plays and loops, so the first petals are seen falling from
// the top. If B is not buffered by then, A holds until it is. `onShowerFalling` runs once, as B
// first wraps round: the toss has come down and its petals are falling past the couple.
function crossfadeAfterFirstPass(a, b, onShowerFalling) {
  b.preload = 'auto'
  b.load()

  const ready = new Promise((resolve) => {
    if (b.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) resolve()
    else b.addEventListener('canplay', resolve, { once: true })
  }).then(
    () =>
      new Promise((resolve) => {
        b.addEventListener('seeked', resolve, { once: true })
        b.currentTime = SHOWER_START
      }),
  )
  // timeupdate fires about every 250 ms, so the fade can start up to that much late; A's held last
  // frame covers the gap.
  const nearEnd = new Promise((resolve) => {
    const onTime = () => {
      if (a.duration - a.currentTime > FADE) return
      a.removeEventListener('timeupdate', onTime)
      resolve()
    }
    a.addEventListener('timeupdate', onTime)
    a.addEventListener('ended', resolve, { once: true })
  })

  let last = SHOWER_START
  const onWrap = () => {
    if (b.currentTime >= last) {
      last = b.currentTime
      return
    }
    b.removeEventListener('timeupdate', onWrap)
    onShowerFalling()
  }
  b.addEventListener('timeupdate', onWrap)

  Promise.all([ready, nearEnd]).then(async () => {
    await animate(b, { opacity: 1, duration: FADE * 1000, ease: 'inOut(2)' })
    b.playbackRate = SHOWER_SPEED
    b.play().catch(() => {})
  })
}

// The hero waits hidden under the gate, then surfaces out of the gate video's closing mist.
export function setupHero(hero, { reduceMotion, onShowerFalling }) {
  const media = hero.querySelector('.hero-media')
  const [a, b] = media.querySelectorAll('video')
  const lines = hero.querySelectorAll('.hero-text > *')
  utils.set([media, ...lines], { opacity: 0 })
  // Reduced motion keeps A's poster as a still.
  if (reduceMotion) a.preload = 'none'

  return function revealHero() {
    if (reduceMotion) {
      animate([media, ...lines], { opacity: 1, duration: 600, ease: 'linear' })
      return
    }
    a.play().catch(() => {})
    crossfadeAfterFirstPass(a, b, onShowerFalling)
    animate(media, {
      opacity: 1,
      scale: [1.06, 1],
      filter: ['blur(14px)', 'blur(0px)'],
      duration: 1800,
      ease: 'out(3)',
    })
    // Line by line, once the mist has mostly cleared.
    animate(lines, {
      opacity: 1,
      translateY: [16, 0],
      filter: ['blur(6px)', 'blur(0px)'],
      delay: stagger(180, { start: 700 }),
      duration: 900,
      ease: 'out(3)',
    })
  }
}
