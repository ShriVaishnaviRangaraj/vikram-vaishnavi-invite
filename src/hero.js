import { animate, stagger, utils } from 'animejs'

// A plays one full pass; on its wrap, B (the flower shower) crossfades in over it and keeps looping.
function crossfadeAfterFirstPass(a, b) {
  a.addEventListener(
    'playing',
    () => {
      b.preload = 'auto'
      b.load()
    },
    { once: true },
  )

  let last = 0
  const onTime = () => {
    if (a.currentTime >= last) {
      last = a.currentTime
      return
    }
    a.removeEventListener('timeupdate', onTime)
    b.play()
      .then(async () => {
        await animate(b, { opacity: 1, duration: 1500, ease: 'inOutQuad' })
        a.pause()
      })
      .catch(() => {})
  }
  a.addEventListener('timeupdate', onTime)
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
