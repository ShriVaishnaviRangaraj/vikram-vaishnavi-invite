import { animate, onScroll, utils } from 'animejs'

// Plain fade-ups. The per-beat motion comes in "Motion pass, beat by beat" (#10).
export function setupReveals(elements, { reduceMotion }) {
  for (const el of elements) {
    utils.set(el, { opacity: 0 })
    animate(el, {
      opacity: 1,
      translateY: reduceMotion ? 0 : [24, 0],
      duration: 800,
      ease: 'out(3)',
      autoplay: onScroll({ target: el }),
    })
  }
}
