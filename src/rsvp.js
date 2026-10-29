import { animate, stagger } from 'animejs'

function readRsvp(form) {
  const data = new FormData(form)
  const attending = data.get('attending') === 'yes'
  return {
    name: String(data.get('name')).trim(),
    attending,
    guests: attending ? Math.min(20, Math.max(1, Math.round(Number(data.get('guests'))) || 1)) : 0,
    message: String(data.get('message')).trim(),
    botcheck: data.get('botcheck') === 'on',
  }
}

// Web3Forms emails every field it is sent, so the keys double as the email's labels. Sent as
// FormData, not JSON: that keeps it a "simple" request with no CORS preflight, which Web3Forms'
// Cloudflare front rejects.
async function sendRsvp(accessKey, { name, attending, guests, message, botcheck }) {
  const body = new FormData()
  for (const [key, value] of Object.entries({
    access_key: accessKey,
    subject: `RSVP: ${name} (${attending ? `attending, ${guests}` : 'declined'})`,
    from_name: 'Vikram & Vaishnavi invite',
    Name: name,
    Attending: attending ? 'Yes' : 'No',
    Guests: guests,
    Message: message || '-',
  })) {
    body.append(key, value)
  }
  if (botcheck) body.append('botcheck', 'on')
  const res = await fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: { Accept: 'application/json' },
    body,
  })
  const reply = await res.json()
  if (!reply.success) throw new Error(reply.message || 'rejected')
}

export function setupRsvp({ opener, form, error, thanks, accessKey, reduceMotion }) {
  const unfold = (targets) =>
    animate(targets, {
      opacity: [0, 1],
      ...(!reduceMotion && { translateY: [20, 0] }),
      delay: stagger(90),
      duration: 600,
      ease: 'out(3)',
    })
  const showError = (text) => {
    error.textContent = text
    error.hidden = false
  }

  // The button gives way to the form, whose fields unfold one by one.
  opener.addEventListener('click', () => {
    opener.hidden = true
    form.hidden = false
    unfold(form.querySelectorAll(':scope > :is(label:not(.trap), fieldset, button)'))
    form.elements.name.focus({ preventScroll: true })
  })

  const submit = form.querySelector('button[type=submit]')
  form.addEventListener('submit', async (event) => {
    event.preventDefault()
    const rsvp = readRsvp(form)
    if (!rsvp.name) {
      showError('Please tell us your name.')
      form.elements.name.focus()
      return
    }
    if (!accessKey) {
      showError('RSVPs are not open yet. Please check back soon.')
      return
    }
    error.hidden = true
    submit.disabled = true
    submit.textContent = 'Sending…'
    try {
      await sendRsvp(accessKey, rsvp)
    } catch {
      showError('We could not send your RSVP. Please check your connection and try again.')
      submit.disabled = false
      submit.textContent = 'Send RSVP'
      return
    }

    // The form gives way to a thank-you note.
    const [title, note] = thanks.children
    title.textContent = `Thank you, ${rsvp.name}!`
    note.textContent = rsvp.attending
      ? 'We have your RSVP and cannot wait to celebrate with you.'
      : 'Thank you for letting us know. You will be missed.'
    form.hidden = true
    thanks.hidden = false
    thanks.focus({ preventScroll: true })
    unfold(thanks.children)
  })
}
