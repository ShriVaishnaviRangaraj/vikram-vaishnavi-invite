import { animate, createTimer } from 'animejs'

// The clip's last ~0.4 s is flat ivory mist. Handing over there, not on `ended`, lets the hero
// surface out of the mist instead of after it.
const MIST = 0.45
const CRACK = 160

function playIntoMist(video) {
  return new Promise((resolve) => {
    const onTime = () => {
      if (video.duration - video.currentTime > MIST) return
      video.removeEventListener('timeupdate', onTime)
      resolve()
    }
    video.addEventListener('timeupdate', onTime)
    video.addEventListener('ended', resolve, { once: true })
    video.play().catch(resolve)
  })
}

// The seal presses in, then its two halves hinge apart along the crack and fall away. Resolves as
// they start to fall, so the doors open behind them.
function breakSeal(button) {
  const [left, right] = button.querySelectorAll('.seal-half')
  animate(button.querySelector('.gate-hint'), { opacity: 0, duration: 200, ease: 'out(2)' })
  animate(button.querySelector('.seal'), { scale: [1, 0.92, 1.06], duration: 260, ease: 'out(2)' })
  const fall = { opacity: 0, translateY: 18, delay: CRACK, duration: 520, ease: 'in(2)' }
  animate(left, { ...fall, rotate: -24, translateX: -14 })
  animate(right, { ...fall, rotate: 24, translateX: 14 })
  return createTimer({ duration: CRACK })
}

export function setupGate(gate, { reduceMotion, onOpen, onOpened }) {
  const button = gate.querySelector('#gate-open')
  const video = gate.querySelector('.gate-video')
  // Idle life before the tap: the door breathes in and out, and the seal glows. The first
  // drop-shadow repeats the seal's resting shadow from the stylesheet.
  const idle = reduceMotion
    ? []
    : [
        animate(video, { scale: [1, 1.03], duration: 6000, ease: 'inOut(2)', loop: true, alternate: true }),
        animate(button.querySelector('.seal'), {
          filter: [
            'drop-shadow(0 4px 6px rgb(42 33 28 / 0.5)) drop-shadow(0 0 2px rgb(241 213 149 / 0.2))',
            'drop-shadow(0 4px 6px rgb(42 33 28 / 0.5)) drop-shadow(0 0 16px rgb(241 213 149 / 0.85))',
          ],
          duration: 1600,
          ease: 'inOut(2)',
          loop: true,
          alternate: true,
        }),
      ]

  button.addEventListener(
    'click',
    async () => {
      button.disabled = true
      onOpen()
      if (!reduceMotion) {
        // Paused, not reverted, so the door clip starts from the zoom it has reached.
        for (const anim of idle) anim.pause()
        await breakSeal(button)
        await playIntoMist(video)
      }
      onOpened()
      await animate(gate, { opacity: 0, duration: reduceMotion ? 600 : 1000, ease: 'inOut(2)' })
      gate.remove()
      document.body.classList.remove('is-gated')
    },
    { once: true },
  )
}
