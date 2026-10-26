export function setupChrome({ musicButton, menuButton, menu }) {
  // State only: the audio loop lands with "Generate the music loop" (#9).
  const setMusic = (on) => {
    musicButton.setAttribute('aria-pressed', String(on))
    musicButton.setAttribute('aria-label', on ? 'Pause music' : 'Play music')
  }
  musicButton.addEventListener('click', () => {
    setMusic(musicButton.getAttribute('aria-pressed') !== 'true')
  })

  const setMenu = (open) => {
    menu.hidden = !open
    menuButton.setAttribute('aria-expanded', String(open))
    menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu')
  }
  menuButton.addEventListener('click', () => setMenu(menu.hidden))
  menu.addEventListener('click', (event) => {
    if (event.target.closest('a')) setMenu(false)
  })

  return { setMusic }
}
