import { animate } from 'animejs'

// The clip ends on ivory mist; the hero fades in underneath as the gate fades out.
function playToEnd(video) {
  return new Promise((resolve) => {
    video.addEventListener('ended', resolve, { once: true })
    video.play().catch(resolve)
  })
}

export function setupGate(gate, { reduceMotion, onOpen, onOpened }) {
  const button = gate.querySelector('#gate-open')
  const video = gate.querySelector('.gate-video')

  button.addEventListener(
    'click',
    async () => {
      button.disabled = true
      onOpen()
      if (!reduceMotion) {
        animate([button, gate.querySelector('.gate-hint')], { opacity: 0, scale: 0.85, duration: 300, ease: 'outQuad' })
        await playToEnd(video)
      }
      onOpened()
      await animate(gate, { opacity: 0, duration: 600, ease: 'inOutQuad' })
      gate.remove()
      document.body.classList.remove('is-gated')
    },
    { once: true },
  )
}
