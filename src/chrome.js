import { animate, stagger } from 'animejs'

export function setupChrome({ musicButton, menuButton, menu, onMusic, reduceMotion }) {
  const setMusic = (on) => {
    musicButton.setAttribute('aria-pressed', String(on))
    musicButton.setAttribute('aria-label', on ? 'Pause music' : 'Play music')
    onMusic(on)
  }
  musicButton.addEventListener('click', () => {
    setMusic(musicButton.getAttribute('aria-pressed') !== 'true')
  })

  const links = [...menu.querySelectorAll('a')]
  // Everything but the toggle and the menu goes inert, so focus and taps stay inside.
  const inertWhileOpen = [document.querySelector('.page'), document.querySelector('.monogram'), musicButton]
  let open = false
  let fade

  // `restoreFocus` is off for a link tap: the browser moves focus to the section it jumps to.
  const setMenu = (next, { restoreFocus = true } = {}) => {
    open = next
    menuButton.setAttribute('aria-expanded', String(open))
    menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu')
    document.documentElement.classList.toggle('is-menu-open', open)
    for (const el of inertWhileOpen) el.inert = open
    fade?.cancel()
    if (open) {
      menu.hidden = false
      fade = animate(menu, { opacity: [0, 1], duration: 350, ease: 'out(2)' })
      animate(menu.querySelectorAll('.menu-art, a, .menu-names'), {
        opacity: [0, 1],
        ...(!reduceMotion && { translateY: [16, 0] }),
        delay: stagger(60, { start: 120 }),
        duration: 500,
        ease: 'out(3)',
      })
      links[0].focus({ preventScroll: true })
    } else {
      fade = animate(menu, { opacity: 0, duration: 200, ease: 'in(2)', onComplete: () => (menu.hidden = true) })
      if (restoreFocus) menuButton.focus({ preventScroll: true })
    }
  }

  menuButton.addEventListener('click', () => setMenu(!open))
  menu.addEventListener('click', (event) => {
    if (event.target.closest('a')) setMenu(false, { restoreFocus: false })
  })
  // Escape closes; Tab cycles through the toggle and the links only.
  document.addEventListener('keydown', (event) => {
    if (!open) return
    if (event.key === 'Escape') {
      setMenu(false)
      return
    }
    if (event.key !== 'Tab') return
    event.preventDefault()
    const stops = [menuButton, ...links]
    const at = stops.indexOf(document.activeElement)
    stops[(at + (event.shiftKey ? -1 : 1) + stops.length) % stops.length].focus()
  })

  return { setMusic }
}
