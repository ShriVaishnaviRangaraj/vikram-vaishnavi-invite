import { animate, stagger, utils } from 'animejs'

// The hero waits hidden under the gate, then surfaces out of the gate video's closing mist.
export function setupHero(hero, { reduceMotion }) {
  const still = hero.querySelector('.hero-still')
  const lines = hero.querySelectorAll('.hero-text > *')
  utils.set([still, ...lines], { opacity: 0 })

  return function revealHero() {
    if (reduceMotion) {
      animate([still, ...lines], { opacity: 1, duration: 600, ease: 'linear' })
      return
    }
    animate(still, {
      opacity: 1,
      scale: [1.06, 1],
      filter: ['blur(14px)', 'blur(0px)'],
      duration: 1200,
      ease: 'outQuad',
    })
    animate(lines, {
      opacity: 1,
      translateY: [14, 0],
      delay: stagger(110, { start: 300 }),
      duration: 700,
      ease: 'outQuad',
    })
  }
}
