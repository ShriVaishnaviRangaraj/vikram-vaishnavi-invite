export function buildRsvpLink(number, { name, attending, guests, message }) {
  const lines = [
    "RSVP for Vikram & Vaishnavi's wedding",
    `Name: ${name}`,
    attending ? 'Joyfully accepts' : 'Regretfully declines',
  ]
  if (attending) lines.push(`Guests: ${guests}`)
  if (message) lines.push(`Message: ${message}`)
  return `https://wa.me/${number}?text=${encodeURIComponent(lines.join('\n'))}`
}

export function setupRsvp(form, error, number) {
  form.addEventListener('submit', (event) => {
    event.preventDefault()
    const data = new FormData(form)
    const name = String(data.get('name')).trim()
    if (!name) {
      error.textContent = 'Please tell us your name.'
      error.hidden = false
      form.elements.name.focus()
      return
    }
    error.hidden = true

    const url = buildRsvpLink(number, {
      name,
      attending: data.get('attending') === 'yes',
      guests: Math.max(1, Number(data.get('guests')) || 1),
      message: String(data.get('message')).trim(),
    })
    window.open(url, '_blank', 'noopener')
  })
}
