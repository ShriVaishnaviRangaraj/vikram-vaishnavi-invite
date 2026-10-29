// The couple's spoken invitation. It plays by itself, voices and all, once most of its frame is
// on screen, with the song dipped under it; scrolled away, it pauses and the song comes back.
// Coming back after it has ended plays it again from the start.
//
// Phones only let a video play sound after a tap on the page, and iOS ties that to the video
// itself, so the gate tap unlocks it ahead of time (`unlock`). Should a browser block the sound all
// the same, it plays muted and a tap on it turns the sound on. `untilEnded` resolves once the video
// has played to its end, for the tour to hold on it; it gives up a few seconds after the end should
// the video stall.
export function setupMessage(section, { url, poster, duckMusic }) {
  if (!url) return { unlock() {}, untilEnded: () => Promise.resolve() }
  section.hidden = false
  const video = section.querySelector('.message-video')
  const hint = section.querySelector('.message-sound')
  video.src = url
  if (poster) video.poster = poster

  let unlocking = false
  const speaking = () => !video.paused && !video.muted
  const update = () => !unlocking && duckMusic(speaking())
  for (const type of ['play', 'pause', 'ended', 'volumechange']) video.addEventListener(type, update)

  const play = () => {
    if (video.ended) video.currentTime = 0
    video.play().catch(() => {
      video.muted = true
      hint.hidden = false
      video.play().catch(() => {})
    })
  }
  video.addEventListener('click', () => {
    if (!video.muted) return
    video.muted = false
    hint.hidden = true
  })

  new IntersectionObserver(
    ([entry]) => {
      if (entry.intersectionRatio >= 0.6) play()
      else if (entry.intersectionRatio < 0.25) video.pause()
    },
    { threshold: [0.25, 0.6] },
  ).observe(video)

  const untilEnded = () =>
    new Promise((resolve) => {
      if (video.ended) return resolve()
      video.addEventListener('ended', resolve, { once: true })
      const left = (video.duration || 60) - video.currentTime
      setTimeout(resolve, (left + 3) * 1000)
    })

  // MUST run inside a user gesture: a play stopped at once earns the video its sound. iOS only
  // counts an unmuted play, so it may let the first instant of the clip through.
  function unlock() {
    unlocking = true
    video
      .play()
      .then(() => {
        video.pause()
        video.currentTime = 0
      })
      .catch(() => {})
      .finally(() => (unlocking = false))
  }

  return { unlock, untilEnded }
}
