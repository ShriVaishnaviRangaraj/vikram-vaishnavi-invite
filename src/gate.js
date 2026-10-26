import { animate, createTimeline } from 'animejs'

export function setupGate(gate, { reduceMotion, onOpen }) {
  const button = gate.querySelector('#gate-open')

  button.addEventListener(
    'click',
    async () => {
      button.disabled = true
      onOpen()
      if (!reduceMotion) {
        await createTimeline()
          .add([button, gate.querySelector('.gate-hint')], { opacity: 0, scale: 0.85, duration: 300, ease: 'outQuad' })
          .add(
            gate.querySelectorAll('.door'),
            {
              rotateY: (door) => (door.classList.contains('door-left') ? -100 : 100),
              duration: 1800,
              ease: 'inOutQuad',
            },
            150,
          )
          .add(gate.querySelectorAll('.door-shade'), { opacity: 1, duration: 1800, ease: 'inQuad' }, 150)
          .add(gate, { scale: [1, 1.08], duration: 2200, ease: 'outSine' }, 150)
          .add(gate.querySelector('.mist'), { opacity: [0, 1], scale: [0.5, 1.2], duration: 1500, ease: 'outQuad' }, 700)
      }
      await animate(gate, { opacity: 0, duration: 700, ease: 'inQuad' })
      gate.remove()
      document.body.classList.remove('is-gated')
    },
    { once: true },
  )
}
