import { animate, createDrawable, createScope, createTimeline, onScroll, stagger, utils } from 'animejs'

// The trigger's top has crossed 85% of the viewport.
const IN_VIEW = 'bottom-=15% top'
const REST = { opacity: 1, translateX: 0, translateY: 0, scale: 1 }

const token = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim()

// Every scroll-driven beat after the hero intro. Under reduced motion each one collapses to a
// plain opacity fade, the scrubs keep only opacity and colour, and the corridor stays on its poster.
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

    // Line art draws its strokes in, centre first, once it scrolls into view.
    const drawIn = (svg) => {
      if (reduce) return reveal(svg, { opacity: 0 })
      const strokes = createDrawable(`${svg} path`)
      utils.set(strokes, { draw: '0 0' })
      onceInView(svg, () => animate(strokes, { draw: '0 1', duration: 1400, delay: stagger(110), ease: 'inOut(2)' }))
    }

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

    // Welcome + countdown
    drawIn('.welcome .divider')
    reveal('.countdown > div', rise(16), { trigger: '.countdown', delay: stagger(90) })

    // Thirukkural
    reveal('.kural > *', rise(20), { trigger: '.kural', delay: stagger(180) })

    // Divine scene: the still rises in, then drifts slower than the page.
    reveal('.divine-frame', rise(80), { duration: 1400 })
    if (!reduce) {
      animate('.divine-still', { translateY: ['-8%', '8%'], ease: 'linear', autoplay: scrub('#divine', 'bottom top', 'top bottom') })
    }

    // Timeline: the centre line draws with the scroll; each event comes in from its side.
    if (reduce) {
      reveal('.timeline-line', { opacity: 0 })
    } else {
      animate(createDrawable('.timeline-line line'), {
        draw: ['0 0', '0 1'],
        ease: 'linear',
        autoplay: scrub('.timeline', 'bottom-=20% top', 'center+=10% bottom'),
      })
    }
    reveal('.event.left', { opacity: 0, translateX: -32 })
    reveal('.event.right', { opacity: 0, translateX: 32 })

    // Reception: the page flips from ivory to maroon, then the card rises.
    animate('#reception', {
      backgroundColor: [token('--ivory'), token('--maroon')],
      ease: 'linear',
      autoplay: scrub('#reception', 'bottom top', 'center top'),
    })
    reveal('.card-maroon', rise(80), { duration: 1200 })
    reveal('.card-maroon > *', rise(12), { trigger: '.card-maroon', delay: stagger(80, { start: 400 }) })

    // Bridge: the corridor pins for one screen while caption A hands over to caption B.
    const drift = (from, to) => (reduce ? {} : { translateY: [from, to] })
    createTimeline({ defaults: { ease: 'linear' }, autoplay: scrub('#bridge', 'top top', 'bottom bottom') })
      .add('.caption-a', { opacity: [1, 0], ...drift(0, -24), duration: 150 }, 350)
      .add('.caption-b', { opacity: [0, 1], ...drift(24, 0), duration: 150 }, 500)
      .add('.caption-b', { opacity: 1, duration: 350 }, 650)
    const corridor = utils.$('.corridor')[0]
    if (reduce) {
      corridor.pause()
      // load() puts a played video back on its poster.
      if (corridor.currentTime) corridor.load()
    } else {
      onScroll({
        target: '#bridge',
        onEnter: () => corridor.play().catch(() => {}),
        onLeave: () => corridor.pause(),
      })
    }

    // Muhurtham: the lotus ornament draws in, then the card rises.
    drawIn('.ornament')
    reveal('.card-ivory', { ...rise(80), scale: 0.96 }, { duration: 1200 })
    reveal('.card-ivory > *', rise(12), { trigger: '.card-ivory', delay: stagger(80, { start: 400 }) })

    // RSVP
    reveal('.rsvp-form > :is(label, fieldset, button)', rise(20), { trigger: '.rsvp-form', delay: stagger(110) })
    reveal('.signature > *', rise(16), { delay: stagger(200) })
  })
}
