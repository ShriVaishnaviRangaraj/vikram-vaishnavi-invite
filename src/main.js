import './style.css'
import { MESSAGE_POSTER, MESSAGE_VIDEO, MUHURTHAM, RSVP_ACCESS_KEY } from './config.js'
import { setupChrome } from './chrome.js'
import { startCountdown } from './countdown.js'
import { setupGate } from './gate.js'
import { setupHero } from './hero.js'
import { setupMessage } from './message.js'
import { setupMotion } from './motion.js'
import { createMusic } from './music.js'
import { setupRsvp } from './rsvp.js'
import { createTour, pause } from './tour.js'

// The invitation always opens on the hero: no scroll position restored by a refresh or the back
// button, and no jump to a #section from the address. Instant, not the page's smooth scroll.
history.scrollRestoration = 'manual'
if (location.hash) history.replaceState(null, '', location.pathname + location.search)
const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'instant' })
scrollToTop()

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

// "Seetha Kalyana Vaibhogame", 0:51.0 to 2:01.6 of the song, cut with a second of lead-in and half
// a second of tail (docs/art-direction/music.md); the loop points skip both.
const music = createMusic({ url: '/assets/music.mp3', from: 0.9755, to: 71.5755 })

const { setMusic } = setupChrome({
  musicButton: document.querySelector('#music-toggle'),
  menuButton: document.querySelector('#menu-toggle'),
  menu: document.querySelector('#menu'),
  onMusic: music.setPlaying,
  reduceMotion,
})

const message = setupMessage(document.querySelector('#message'), {
  url: MESSAGE_VIDEO,
  poster: MESSAGE_POSTER,
  duckMusic: music.duck,
})

// Once the hero's first shower is falling past the couple, the invitation shows itself: a slow
// glide that carries the petals down into the countdown, then on to the couple's message (held
// until it ends), each event of the journey, the venue and the RSVP, pausing at each (tour.js).
const startTour = createTour([
  { el: document.querySelector('#countdown'), duration: 6000, hold: pause(4000) },
  { el: document.querySelector('.message-frame'), hold: message.untilEnded },
  ...[...document.querySelectorAll('.event')].map((el) => ({ el, hold: pause(4500) })),
  { el: document.querySelector('.venue-at'), align: 'top', hold: pause(4500) },
  { el: document.querySelector('#rsvp'), align: 'end' },
])

const revealHero = setupHero(document.querySelector('#hero'), { reduceMotion, onShowerFalling: startTour })

setupGate(document.querySelector('#gate'), {
  reduceMotion,
  onOpen: () => {
    scrollToTop()
    setMusic(true)
    message.unlock()
  },
  onOpened: revealHero,
})

startCountdown(document.querySelector('#countdown'), MUHURTHAM, { reduceMotion })
setupRsvp({
  opener: document.querySelector('#rsvp-open'),
  form: document.querySelector('#rsvp-form'),
  error: document.querySelector('#rsvp-error'),
  thanks: document.querySelector('#rsvp-thanks'),
  accessKey: RSVP_ACCESS_KEY,
  reduceMotion,
})
setupMotion(document.querySelector('.page'))

// "Add to calendar" opens and closes the choice of calendars beneath it, as does its ×.
const calendarOpen = document.querySelector('#calendar-open')
const calendar = document.querySelector('#calendar')
const showCalendar = (shown) => {
  calendar.hidden = !shown
  calendarOpen.setAttribute('aria-expanded', String(shown))
}
calendarOpen.addEventListener('click', () => showCalendar(calendar.hidden))
document.querySelector('#calendar-close').addEventListener('click', () => {
  showCalendar(false)
  calendarOpen.focus({ preventScroll: true })
})
