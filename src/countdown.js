import { animate } from 'animejs'

const SECOND = 1000
const MINUTE = 60 * SECOND
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

export function remaining(target, now = Date.now()) {
  const ms = Math.max(0, target.getTime() - now)
  return {
    days: Math.floor(ms / DAY),
    hours: Math.floor((ms % DAY) / HOUR),
    minutes: Math.floor((ms % HOUR) / MINUTE),
    seconds: Math.floor((ms % MINUTE) / SECOND),
  }
}

export function startCountdown(root, target, { reduceMotion }) {
  const cells = Object.fromEntries(
    [...root.querySelectorAll('[data-unit]')].map((el) => [el.dataset.unit, el]),
  )

  const tick = () => {
    const parts = remaining(target)
    for (const [unit, value] of Object.entries(parts)) {
      const cell = cells[unit]
      const text = String(value).padStart(2, '0')
      if (cell.textContent === text) continue
      cell.textContent = text
      // Each changed digit drops in from above.
      if (!reduceMotion) animate(cell, { translateY: ['-60%', '0%'], opacity: [0, 1], duration: 450, ease: 'out(3)' })
    }
    if (target.getTime() <= Date.now()) clearInterval(timer)
  }

  const timer = setInterval(tick, SECOND)
  tick()
}
