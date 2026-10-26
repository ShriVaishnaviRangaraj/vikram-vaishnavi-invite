import './style.css'
import { MUHURTHAM, RSVP_WHATSAPP_NUMBER } from './config.js'
import { setupChrome } from './chrome.js'
import { startCountdown } from './countdown.js'
import { setupGate } from './gate.js'
import { setupHero } from './hero.js'
import { setupReveals } from './reveal.js'
import { setupRsvp } from './rsvp.js'

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

const { setMusic } = setupChrome({
  musicButton: document.querySelector('#music-toggle'),
  menuButton: document.querySelector('#menu-toggle'),
  menu: document.querySelector('#menu'),
})

const revealHero = setupHero(document.querySelector('#hero'), { reduceMotion })

setupGate(document.querySelector('#gate'), {
  reduceMotion,
  onOpen: () => setMusic(true),
  onOpened: revealHero,
})

startCountdown(document.querySelector('#countdown'), MUHURTHAM)
setupRsvp(document.querySelector('#rsvp-form'), document.querySelector('#rsvp-error'), RSVP_WHATSAPP_NUMBER)
setupReveals(document.querySelectorAll('.reveal'), { reduceMotion })
