import { animate, createDrawable, createScope, onScroll, stagger, utils } from 'animejs'

// The trigger's top has crossed 85% of the viewport.
const IN_VIEW = 'bottom-=15% top'
const REST = { opacity: 1, translateX: 0, translateY: 0, scale: 1, rotate: 0 }
// Rose and marigold petals continuing the hero's flower shower down to the countdown.
const PETALS = 12
const SVG = 'http://www.w3.org/2000/svg'

// Every scroll-driven beat after the hero intro. Under reduced motion each one collapses to a
// plain opacity fade and the scrubs keep only opacity and colour.
export function setupMotion(page) {
  return createScope({ root: page, mediaQueries: { reduce: '(prefers-reduced-motion: reduce)' } }).add((scope) => {
    const reduce = scope.matches.reduce

    const onceInView = (trigger, play) => {
      let played = false
      onScroll({
        target: trigger,
        enter: IN_VIEW,
        repeat: false,
        onEnter: () => {
          if (played) return
          played = true
          play()
        },
      })
    }

    // Holds `from` until the trigger scrolls in, then settles to rest once.
    const reveal = (targets, from, { trigger, ...params } = {}) => {
      const els = utils.$(targets)
      const start = reduce ? { opacity: 0 } : from
      utils.set(els, start)
      const to = Object.fromEntries(Object.keys(start).map((key) => [key, REST[key]]))
      onceInView(trigger ?? els[0], () =>
        animate(els, { ...to, duration: reduce ? 600 : 900, ease: reduce ? 'inOut(2)' : 'out(3)', ...params }),
      )
    }

    const scrub = (target, enter, leave) => onScroll({ target, enter, leave, sync: true })

    const rise = (y) => ({ opacity: 0, translateY: y })

    // Hero exit: the names drift up and fade, then the hero dissolves to ivory.
    animate('.hero-text', {
      opacity: [1, 0],
      translateY: reduce ? 0 : [0, -120],
      ease: 'in(2)',
      autoplay: scrub('#hero', 'top top', 'top center'),
    })
    animate('.hero-veil', { opacity: [0, 1], ease: 'linear', autoplay: scrub('#hero', 'top top', 'top bottom') })
    if (!reduce) {
      animate('.cue-line', {
        scaleY: [{ from: 0, to: 1, duration: 1200, ease: 'inOut(2)' }],
        opacity: [{ to: 1, duration: 900 }, { to: 0, duration: 500 }],
        loop: true,
        loopDelay: 400,
      })
    }

    for (const el of utils.$('.reveal')) reveal(el, rise(24))

    // Welcome + countdown. The lotus opens, the creeper grows out from it to both sides, and its
    // leaves and flowers open in order along the vine.
    if (reduce) {
      reveal('.welcome .divider', { opacity: 0 })
    } else {
      const vines = createDrawable('.welcome .divider .vine')
      const blooms = '.welcome .divider .bloom'
      utils.set(vines, { draw: '0 0' })
      utils.set(blooms, { scale: 0, opacity: 0 })
      onceInView('.welcome .divider', () => {
        animate(vines, { draw: '0 1', delay: 300, duration: 1600, ease: 'inOut(2)' })
        animate(blooms, { scale: 1, opacity: 1, delay: (el) => 160 * el.dataset.order, duration: 700, ease: 'out(3)' })
      })
    }
    // The hero's petals keep falling with the scroll that brings the countdown from the bottom of
    // the screen to its centre, fading before they reach it. Four flowers fall among them as small
    // closed buds, flipping as they go; near the countdown they grow, turn to face the guest and
    // bloom open as they land with a ripple of gold light, and the numbers surface as each
    // settles. They then turn slowly (in the stylesheet). The fall only follows the scroll down:
    // scrolling back up, the petals still in the air fade away and the flowers finish landing,
    // and once the countdown is back below the screen it all resets for the next way down.
    // Emptied first: the scope re-runs this when the reduced-motion setting changes.
    page.querySelector('.petal-shower').replaceChildren(
      ...Array.from({ length: PETALS }, (_, i) => {
        const petal = document.createElementNS(SVG, 'svg')
        petal.setAttribute('class', i % 3 ? 'rose-petal' : 'rose-petal marigold')
        petal.innerHTML = '<use href="#rose-petal" />'
        Object.assign(petal.style, { left: `${utils.random(4, 92)}%`, top: `${utils.random(0, 35)}%`, width: `${utils.random(10, 18)}px` })
        return petal
      }),
    )
    if (reduce) {
      reveal('.countdown > div', { opacity: 0 }, { trigger: '.countdown', delay: stagger(90) })
    } else {
      const drop = window.innerHeight
      const shower = animate('.rose-petal', {
        translateY: () => drop * utils.random(0.8, 1.2, 2),
        translateX: [{ to: () => utils.random(-40, 40) }, { to: () => utils.random(-40, 40) }, { to: () => utils.random(-20, 20) }],
        rotate: () => utils.random(-360, 360),
        rotateX: () => utils.random(-180, 180),
        opacity: [{ to: 1, duration: 150 }, { to: 1, duration: 550 }, { to: 0, duration: 300 }],
        duration: 1000,
        ease: 'linear',
        autoplay: false,
      })

      utils.set('.countdown > div', { opacity: 0, scale: 0.3, '--bloom': 0.35, '--land': 0, '--ripple': 0 })
      const flowers = animate('.countdown > div', {
        translateY: { from: () => -drop * utils.random(0.8, 1, 2), to: 0, ease: 'out(1.5)' },
        translateX: [
          { to: () => utils.random(-50, 50), ease: 'inOut(2)' },
          { to: () => utils.random(-40, 40), ease: 'inOut(2)' },
          { to: 0, ease: 'inOut(2)' },
        ],
        rotate: { from: () => utils.random(-200, 200), to: 0, ease: 'out(2)' },
        rotateY: { from: () => (utils.random(0, 1) ? 540 : -540), to: 0, ease: 'out(3)' },
        scale: [{ to: 0.3, duration: 550 }, { to: 1, duration: 350, ease: 'out(3)' }, { to: 1, duration: 100 }],
        '--bloom': [{ to: 0.35, duration: 700 }, { to: 1, duration: 300, ease: 'out(3)' }],
        opacity: [{ to: 1, duration: 120 }, { to: 1, duration: 880 }],
        '--land': [{ to: 0, duration: 800 }, { to: 1, duration: 200 }],
        '--ripple': [{ to: 0, duration: 860 }, { to: 1, duration: 140 }],
        duration: 1000,
        ease: 'linear',
        autoplay: false,
      })

      // How far down the fall has been scrolled; it never goes back until the reset.
      let reached = 0
      let settle = null
      const showAt = (progress) => {
        reached = progress
        shower.seek(progress * shower.duration)
        flowers.seek(progress * flowers.duration)
      }
      onScroll({
        target: '.countdown',
        enter: 'bottom top',
        leave: 'center center',
        onUpdate: (self) => {
          if (!self.backward) {
            if (self.progress > reached) showAt(self.progress)
            return
          }
          if (reached === 0 || reached === 1) return
          const from = { progress: reached }
          reached = 1
          animate('.petal-shower', { opacity: 0, duration: 300, ease: 'out(2)' })
          settle = animate(from, {
            progress: 1,
            duration: 700,
            ease: 'out(2)',
            onUpdate: () => flowers.seek(from.progress * flowers.duration),
          })
        },
        onLeaveBackward: () => {
          settle?.pause()
          utils.set('.petal-shower', { opacity: 1 })
          showAt(0)
        },
      })
    }

    // Journey: as each event comes into view its picture rises in and settles, then its lines
    // follow one by one.
    for (const event of utils.$('.event')) {
      reveal(event.querySelector('.event-photo'), { ...rise(48), scale: 0.94 }, { duration: 1200 })
      reveal(event.querySelectorAll(':scope > :not(.event-photo)'), rise(12), {
        trigger: event.querySelector('.event-photo'),
        delay: stagger(110, { start: 500 }),
      })
    }

    // RSVP. The form unfolds on its own when opened (rsvp.js).
    reveal('.signature > *', rise(16), { delay: stagger(200) })
  })
}
