# Reference video — beat sheet

Source: `~/Downloads/WhatsApp Video 2026-10-25 at 16.55.48.mp4` (48.7 s, 384×848, 60 fps, AAC).
It is an Instagram reel showing someone filming a phone that scrolls through a mobile-first
single-page invite site (`*.netlify.app`, couple "Ananya & Karthik"). There are no hard cuts.
Every beat is either a scroll position or an in-page transition.

The video is not checked in. `keyframes/01.jpg`–`05.jpg` hold cropped frames at
1, 2.5, 3.2, 5.5, 9.5, 11 / 13, 15.5, 17, 18, 19, 21.5 / 23, 25.5, 26, 27.5, 29, 30 /
31, 33.5, 35, 36, 38, 39 / 40, 41, 42.5, 43.5, 45, 47 s, six per file, left to right.

Persistent chrome: "A & K" monogram top-left; round music-toggle and menu buttons top-right.
Palette: ivory/cream base, muted gold, rose-taupe script; one maroon section (reception);
one blush-pink section (gift). Fonts: script for names, spaced serif caps for labels,
italic serif for body.

| # | Time | Beat | What is on screen | Motion |
|---|------|------|-------------------|--------|
| 1 | 0–3 s | **Gate** | Illustrated carved temple door, banana-leaf + marigold toran, two caparisoned elephants. Play button in the middle. | Tap → the doors swing open (the elephants' trunks part with them) → white mist fills the screen. |
| 2 | 3–11 s | **Hero** | Full-bleed background video: the couple walking, then a mist reveal of the bride (jasmine in her hair) and the groom. Over it: "Sri Gurubhyo Namaha" · "WITH DIVINE BLESSINGS" · script names · "are getting married on" · "SATURDAY, 12 DECEMBER 2026" · "SCROLL TO BEGIN" + a thin line. | Text fades in line by line over a hazy, washed-out video. The video loops. |
| 3 | 11–15 s | **Hero exit** | The video moves to an illustrated couple in front of a temple gopuram. | On scroll, the names drift up and the hero dissolves to cream. |
| 4 | 15–19 s | **Welcome + countdown** | "Two families. Two hearts. One sacred journey." Lamp-icon divider. Live countdown (days · hours · minutes · seconds). "Together with our families, we would love you to be part of our celebration." | Lines fade up; the countdown ticks every second. |
| 5 | 19–20 s | **Thirukkural** | Tamil couplet, its English translation in italics, credit "THIRUKKURAL · 1122". | Fade-up. |
| 6 | 20–25 s | **Divine scene** | A full-width photoreal puja still life: brass kuthuvilakku lamps, an urli bowl of jasmine, lotuses, candles. "In the presence of the divine, a new chapter unfolds." | The image rises in with a soft top/bottom feather; slow parallax. |
| 7 | 25–30 s | **Our Wedding Journey** | A vertical timeline with a centre line. Events alternate left/right, each with a small illustrated icon: Muhurtham (lamp), Oonjal (swing), Nalangu (turmeric bowl), Reception (kuthuvilakku). | The line draws as you scroll; each event fades in from its side. |
| 8 | 30–36 s | **Muhurtham card** | Lotus ornament + "TRADITION LIVES ON". Jasmine clusters in the corners. Framed card: gopuram/lotus icon, "WEDDING · MUHURTHAM", date, time, temple + town, "Where sacred vows become the beginning of forever", gold "VIEW LOCATION" button. | The ornament draws in; the card rises; the jasmine clusters scale in. |
| 9 | 36–39 s | **Bridge** | Full-bleed temple corridor (pillared mandapam, garlands), dark and warm. "FROM SACRED VOWS…" swaps to "…TO AN EVENING OF CELEBRATION". | Pinned section; the caption cross-fades as you scroll through it. |
| 10 | 39–41 s | **Reception card** | Deep maroon card with a gold border. "RECEPTION · VAAZHTHU VIZHA", date, "7:00 PM onwards", venue, "An evening of love, laughter and a lifetime ahead", gold "VIEW LOCATION". | The page colour flips from cream to maroon; the card rises. |
| 11 | 41–43 s | **Blessings / gift** | Blush-pink card: "WITH LOVE & BLESSINGS", a short line, a UPI QR code, "SCAN WITH ANY UPI APP". | Fade-up. |
| 12 | 43–48 s | **RSVP** | "Will you celebrate with us?" over a faint gopuram. Form: name, Joyfully Accept / Regretfully Decline, number of guests, optional message, gold "SEND RSVP". Footer signature in script. | Fields stagger in. |

## Mapping to Vikram & Vaishnavi

From the printed invite, `invite.webp`:

- Reception — Thursday 19 November 2026, 7:30 PM
- Muhurtham — Friday 20 November 2026, 6:15 AM
- Venue (both) — Brindavan Auditorium, Chinniyampalayam, Coimbatore

Differences that matter:

- **The order is reversed.** The reception is the evening *before* the muhurtham. Beat 9's
  "from sacred vows… to an evening of celebration" has to flip, or be dropped.
- **There is one venue, not two.** The two cards would show the same address twice.
- **Timeline events.** The invite names only two events. Oonjal and Nalangu are not mentioned.
- The countdown target is 20 Nov 2026, 06:15 IST — about 24 days from 26 Oct 2026.

## Generated assets the beats need (Higgsfield, later)

- Gate: illustrated door + elephants. It needs a closed state and an open state, or a short door-opening clip.
- Hero: a looping background video of the couple. The reference uses stylised, illustrated people.
- Divine still life (beat 6), temple corridor (beat 9), faint gopuram (beat 12).
- Small icons for the timeline and cards. These could be hand-drawn SVG instead.
