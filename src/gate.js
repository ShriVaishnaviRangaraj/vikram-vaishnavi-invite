import { animate } from 'animejs'

// The clip's last ~0.4 s is flat ivory mist. Handing over there, not on `ended`, lets the hero
// surface out of the mist instead of after it.
const MIST = 0.45

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

export function setupGate(gate, { reduceMotion, onOpen, onOpened }) {
  const button = gate.querySelector('#gate-open')
  const video = gate.querySelector('.gate-video')
  const hint = gate.querySelector('.gate-hint')
  const breathe = reduceMotion
    ? null
    : animate(button, { scale: [1, 1.08], duration: 1100, ease: 'inOut(2)', loop: true, alternate: true })

  button.addEventListener(
    'click',
    async () => {
      button.disabled = true
      onOpen()
      if (!reduceMotion) {
        breathe.cancel()
        animate([button, hint], { opacity: 0, scale: 0.85, duration: 300, ease: 'out(2)' })
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
