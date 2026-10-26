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

export function startCountdown(root, target) {
  const cells = Object.fromEntries(
    [...root.querySelectorAll('[data-unit]')].map((el) => [el.dataset.unit, el]),
  )

  const tick = () => {
    const parts = remaining(target)
    for (const [unit, value] of Object.entries(parts)) {
      cells[unit].textContent = String(value).padStart(2, '0')
    }
    if (target.getTime() <= Date.now()) clearInterval(timer)
  }

  const timer = setInterval(tick, SECOND)
  tick()
}
