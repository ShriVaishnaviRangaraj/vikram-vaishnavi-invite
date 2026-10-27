import { animate, stagger, utils } from 'animejs'

const FADE = 1.5

// A plays once and holds its last frame. B (the flower shower) fades in over A's last 1.5 s while
// paused on its first frame, then plays and loops, so the petal toss is seen from its start. If B
// is not buffered by then, A holds until it is.
function crossfadeAfterFirstPass(a, b) {
  b.preload = 'auto'
  b.load()

  const ready = new Promise((resolve) => {
    if (b.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) resolve()
    else b.addEventListener('canplay', resolve, { once: true })
  })
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

  Promise.all([ready, nearEnd]).then(async () => {
    await animate(b, { opacity: 1, duration: FADE * 1000, ease: 'inOut(2)' })
    b.play().catch(() => {})
  })
}

// The hero waits hidden under the gate, then surfaces out of the gate video's closing mist.
export function setupHero(hero, { reduceMotion }) {
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
    crossfadeAfterFirstPass(a, b)
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
