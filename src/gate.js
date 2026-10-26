import { animate } from 'animejs'

export function setupGate(gate, { reduceMotion, onOpen }) {
  const button = gate.querySelector('#gate-open')

  button.addEventListener(
    'click',
    async () => {
      button.disabled = true
      onOpen()
      if (!reduceMotion) {
        await animate(gate.querySelectorAll('.door'), {
          rotateY: (door) => (door.classList.contains('door-left') ? -105 : 105),
          duration: 1400,
          ease: 'inOutCubic',
        })
      }
      await animate(gate, { opacity: 0, duration: 500, ease: 'linear' })
      gate.remove()
      document.body.classList.remove('is-gated')
    },
    { once: true },
  )
}
