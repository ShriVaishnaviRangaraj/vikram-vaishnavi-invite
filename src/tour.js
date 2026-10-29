import { animate } from 'animejs'

// How long the guest must leave the page alone before the tour carries on, and how fast it glides
// between stops when a stop sets no duration of its own.
const IDLE = 4000
const SPEED = 300
// Within this many pixels of a stop counts as being at it.
const NEAR = 80

export const pause = (ms) => () => new Promise((resolve) => setTimeout(resolve, ms))

// Scrolls the invitation itself from stop to stop, holding at each: `{ el, hold, align, duration }`,
// where `hold` returns a promise for when to move on, `align: 'top'` brings the stop to the top of
// the screen, clear of the header, rather than its middle, `align: 'end'` scrolls to the very end
// of the page, and `duration` fixes the glide there in ms. Stops inside a hidden section are
// skipped. Any wheel, touch, key or click hands the page to the guest; once they have left it
// alone for IDLE ms, the tour carries on from wherever they are, at the first stop not above them,
// holding there again if they stopped on it.
export function createTour(stops) {
  // Bumped on every interruption; a leg that sees a newer run has been cancelled and stops.
  let run = 0
  let started = false
  let finished = false
  let lastInput = 0
  let glide
  let idleTimer

  const maxY = () => document.documentElement.scrollHeight - innerHeight
  const yOf = ({ el, align }) => {
    if (align === 'end') return maxY()
    const box = el.getBoundingClientRect()
    const y = align === 'top' ? box.top + scrollY - 48 : box.top + scrollY + box.height / 2 - innerHeight / 2
    return Math.max(0, Math.min(y, maxY()))
  }

  const glideTo = (y, duration) =>
    new Promise((resolve) => {
      const at = { y: scrollY }
      const distance = Math.abs(y - at.y)
      if (distance < 2) return resolve()
      glide = animate(at, {
        y,
        duration: duration ?? Math.min(9000, Math.max(2500, (distance / SPEED) * 1000)),
        ease: 'inOut(2)',
        onUpdate: () => window.scrollTo({ top: at.y, behavior: 'instant' }),
        onComplete: resolve,
      })
    })

  async function tourFrom(id) {
    const list = stops.filter((stop) => stop.el && !stop.el.closest('[hidden]'))
    let i = list.findIndex((stop) => yOf(stop) >= scrollY - NEAR)
    if (i < 0) i = list.length
    for (; i < list.length; i++) {
      const stop = list[i]
      const y = yOf(stop)
      if (Math.abs(y - scrollY) > NEAR) {
        await glideTo(y, stop.duration)
        if (id !== run) return
      }
      await stop.hold?.()
      if (id !== run) return
    }
    finished = true
  }

  const resumeLater = (after) => {
    clearTimeout(idleTimer)
    idleTimer = setTimeout(() => tourFrom(++run), after)
  }

  const interrupt = () => {
    lastInput = Date.now()
    if (!started || finished) return
    run++
    glide?.pause()
    resumeLater(IDLE)
  }
  for (const type of ['wheel', 'touchstart', 'touchmove', 'keydown', 'mousedown']) {
    addEventListener(type, interrupt, { passive: true })
  }

  // Starts the tour, or, if the guest is busy scrolling, as soon as they have stopped.
  return function start() {
    if (started) return
    started = true
    const since = Date.now() - lastInput
    if (since < IDLE) resumeLater(IDLE - since)
    else tourFrom(++run)
  }
}
