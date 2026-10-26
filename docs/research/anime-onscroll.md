# Can anime.js v4 `onScroll` drive the pinned bridge and the drawn timeline?

Ticket: [#3](https://github.com/bontaramsonta/vikram-vaishnavi-invite/issues/3).
Checked against **anime.js 4.5.0** (`npm view animejs version` → `4.5.0`, released 2026-06-22).
All source links point at the `v4.5.0` tag.

## Short answer

Yes. `onScroll` covers every scroll-linked beat. It does **not** pin anything.
Pinning comes from CSS `position: sticky`. `onScroll` only maps scroll position to
the progress of an animation or timeline. No GSAP, no Lenis.

| Question | Answer |
|---|---|
| Does `onScroll` pin? | No. Pin with CSS `position: sticky`. Observe the tall **wrapper**, not the sticky stage. Sync with `sync: true`. |
| Drawn timeline line | Yes. `createDrawable()` + `draw: ['0 0', '0 1']`, linked with `onScroll({ sync: true })`. A `div` with `scaleY` works too. |
| Events fade in from their side | Yes. One `animate()` per event with `autoplay: onScroll({ ... })` in the default `'play pause'` mode. |
| iOS dynamic toolbar | Thresholds use `100lvh` as the viewport height. They do not move when the toolbar shows or hides. Size sections in `svh`/`lvh`, never `dvh`. |
| Momentum scrolling | Driven by native `scroll` events plus a rAF ticker. No scroll hijacking. Verify on a device. |
| `prefers-reduced-motion` | `createScope({ mediaQueries: { reduceMotion: '(prefers-reduced-motion: reduce)' } })`, branch on `self.matches.reduceMotion`. The scope rebuilds itself when the query flips. |
| Import shape | `import { animate, createTimeline, onScroll, createScope, createDrawable, stagger } from 'animejs'`. Tree-shakes in Vite: ~20.5 kB gzip for this set vs ~41 kB for the whole library. |

## 1. Pinning: `onScroll` has no pin

`ScrollObserver` has no pin option. Its parameters are `container`, `target`, `debug`,
`axis`, `repeat`, `enter`, `leave`, `sync`, `id`, and the callbacks
([docs: onScroll](https://animejs.com/documentation/events/onscroll);
[source: constructor](https://github.com/juliangarnier/anime/blob/v4.5.0/src/events/scroll.js#L412-L536)).
It never writes `position` or `transform` on the target.

It is sticky-aware in one way only. While measuring, it sets every `position: sticky`
element from the target up to the container to `static`, reads the rect, then reverts
([scroll.js L776-L783, L842-L844](https://github.com/juliangarnier/anime/blob/v4.5.0/src/events/scroll.js#L776-L844)).
So thresholds come from the element's **natural flow position**, not its stuck position.
The maintainer's guidance on [issue #1027](https://github.com/juliangarnier/anime/issues/1027)
("Scroll Observer ignores css `position:sticky`"): recomputing thresholds while scrolling
would hurt performance, so **track the wrapper instead of the sticky element**.

### Recipe for beat 9 (bridge)

```html
<section class="bridge">            <!-- tall wrapper: the scroll distance -->
  <div class="bridge__stage">       <!-- sticky stage -->
    <img class="bridge__bg" src="corridor.webp" alt="">
    <div class="bridge__safe">      <!-- caption area kept inside the small viewport -->
      <p class="bridge__a">An evening of celebration…</p>
      <p class="bridge__b">…then, sacred vows at dawn</p>
    </div>
  </div>
</section>
```

```css
.bridge        { height: 300lvh; position: relative; }
.bridge__stage { position: sticky; top: 0; height: 100lvh; overflow: hidden; }
.bridge__safe  { height: 100svh; display: grid; place-items: center; }
.bridge__b     { opacity: 0; }
```

```js
const tl = createTimeline({
  autoplay: onScroll({
    target: '.bridge',        // the wrapper, never the sticky stage
    enter: 'top top',         // wrapper top meets viewport top: stage starts sticking
    leave: 'bottom bottom',   // wrapper bottom meets viewport bottom: stage unsticks
    sync: true,
  }),
});
tl.add('.bridge__a', { opacity: [1, 0], y: [0, -16], ease: 'linear', duration: 500 })
  .add('.bridge__b', { opacity: [0, 1], y: [16, 0], ease: 'linear', duration: 500 }, '-=200');
```

Why it works:

- Threshold strings read `'<container> <target>'`. The first word is the container edge,
  the second the target edge. Defaults are `enter: 'end start'` and `leave: 'start end'`
  ([scroll.js L595-L596, L803-L818](https://github.com/juliangarnier/anime/blob/v4.5.0/src/events/scroll.js#L595-L596)).
  Shorthands are `top`, `bottom`, `left`, `right`, `center`, `start`, `end`, plus
  relative offsets like `'bottom-=50'`
  ([docs: position shorthands](https://animejs.com/documentation/events/onscroll/scrollobserver-thresholds/positions-shorthands)).
- `sync: true` (or `1`) seeks the linked timeline to `duration × progress` on every
  scroll tick ([docs: playback progress](https://animejs.com/documentation/events/onscroll/scrollobserver-synchronisation-modes/playback-progress);
  [scroll.js L929-L931](https://github.com/juliangarnier/anime/blob/v4.5.0/src/events/scroll.js#L929-L931)).
- Without `target`, `link()` falls back to the first DOM target of the animation
  ([scroll.js L551-L566](https://github.com/juliangarnier/anime/blob/v4.5.0/src/events/scroll.js#L551-L566)).
  Here that is the caption inside the sticky stage, which gives the wrong range.
  You **MUST** pass `target: '.bridge'`.
- The pin itself is compositor-driven CSS. It cannot jitter or lag behind the finger.
  Only the caption opacity runs on the main thread.

Stage height `100lvh` lines up with the observer: anime.js also measures the viewport
as `100lvh` (see section 3). Progress hits 1 exactly when the stage unsticks.
The caption sits in a `100svh` box so the toolbar never covers it.

CSS gotcha: `overflow: hidden` on any ancestor of the stage breaks `position: sticky`.
Use `overflow-x: clip` on `html`/`body` to stop horizontal bleed
([MDN: overflow `clip`](https://developer.mozilla.org/en-US/docs/Web/CSS/overflow#clip)).
Hiding overflow on both `html` and `body` can also turn `body` into the scroller,
and then the window gets no `scroll` events.

## 2. Drawn timeline (beat 7)

### The line

`createDrawable(target, start = 0, end = 0)` wraps `<line>`, `<path>`, `<polyline>` or
`<rect>` in a `Proxy` with a `draw` property (`'start end'`, both 0–1)
([docs: createDrawable](https://animejs.com/documentation/svg/createdrawable)).
Under the hood it sets `pathLength="1000"` and writes `stroke-dasharray` and
`stroke-dashoffset` on each update
([drawable.js L47, L59-L83, L96-L99](https://github.com/juliangarnier/anime/blob/v4.5.0/src/svg/drawable.js#L46-L102)).
Because `pathLength` is normalised, the line can stretch to any section height with no
length recalculation.

```html
<div class="timeline">
  <svg class="timeline__rule" viewBox="0 0 2 100" preserveAspectRatio="none" aria-hidden="true">
    <line x1="1" y1="0" x2="1" y2="100" stroke="currentColor" stroke-width="2" />
  </svg>
  <article class="ev ev--left">Reception…</article>
  <article class="ev ev--right">Muhurtham…</article>
</div>
```

```css
.timeline__rule { position: absolute; left: 50%; top: 0; width: 2px; height: 100%; }
```

```js
animate(createDrawable('.timeline__rule line'), {
  draw: ['0 0', '0 1'],
  ease: 'linear',
  autoplay: onScroll({
    target: '.timeline',
    enter: 'center top',      // viewport middle meets timeline top
    leave: 'center bottom',   // viewport middle meets timeline bottom
    sync: true,
  }),
});
```

Keep the SVG's viewBox width equal to its rendered width (2 → 2px). Then
`preserveAspectRatio="none"` stretches only the y axis and the stroke width stays put.
Do **not** add `vector-effect: non-scaling-stroke`: the docs warn it is slow, because the
scale factor is recomputed on every tick (drawable.js L51, L69).

Alternative for a plain straight line: a `div` with `transform-origin: top` and
`animate(rule, { scaleY: [0, 1], ease: 'linear', autoplay: onScroll({ ..., sync: true }) })`.
It is cheaper, since `transform` is compositor-friendly, and needs no SVG.
Use `createDrawable` if the line is ornamental or curved.

### The events

The default `sync` mode is the method string `'play pause'`
([scroll.js L418](https://github.com/juliangarnier/anime/blob/v4.5.0/src/events/scroll.js#L418)):
play on enter, pause on leave. That is a time-based fade triggered by scroll, which is
what "fades in from its side as it enters" needs.

```js
document.querySelectorAll('.ev').forEach((el) => {
  const fromLeft = el.classList.contains('ev--left');
  animate(el, {
    opacity: [0, 1],
    x: [fromLeft ? -24 : 24, 0],
    duration: 700,
    ease: 'outQuad',
    autoplay: onScroll({ enter: 'bottom-=15% top', repeat: false }),
  });
});
```

- `repeat: false` reverts the observer once the animation has completed and the element has scrolled past
  ([scroll.js L950-L958](https://github.com/juliangarnier/anime/blob/v4.5.0/src/events/scroll.js#L950-L958)).
- Use `sync: 'play reverse'` instead if events should fade back out when scrolling up.
- Use `sync: true` instead if the fade should scrub with the finger.

## 3. iOS dynamic toolbar and momentum scrolling

What the source does:

- **Viewport height is `100lvh`.** `getMaxViewHeight()` appends a `div` with
  `height: 100lvh` and reads `offsetHeight`
  ([scroll.js L99-L106, L232-L235](https://github.com/juliangarnier/anime/blob/v4.5.0/src/events/scroll.js#L99-L106)).
  When the container is the page, that is the container height used for every
  `bottom`/`end`/`%` threshold (L244-L246). It is the toolbar-hidden height, so it does
  not change when the toolbar shows or hides.
  - Consequence: with the toolbar showing, the container `bottom` edge sits below the
    visible bottom by the toolbar's height. `enter: 'bottom top'` fires a little before
    the element is visible. Use `'bottom-=10%'`-style offsets for reveal triggers.
  - `lvh` needs iOS 15.4+ / Chrome 108+. [Issue #1119](https://github.com/juliangarnier/anime/issues/1119)
    (open) reports wrong thresholds on Safari 12, which lacks `lvh`. Negligible for this audience.
- **Re-measure only on body resize.** A `ResizeObserver` watches the container element
  (`body`), debounced 250 ms ([scroll.js L191-L199, L220-L221](https://github.com/juliangarnier/anime/blob/v4.5.0/src/events/scroll.js#L191-L221)).
  There is no `window` `resize` listener. A toolbar toggle does not resize `body` unless
  the content is sized in `dvh`.
  - You **MUST NOT** size scroll-tracked sections in `dvh`. A `300dvh` wrapper grows and
    shrinks with the toolbar, which triggers a refresh mid-scroll and makes thresholds jump.
    Use `svh` or `lvh`. (Plain `vh` equals `lvh` on iOS.)
  - Call `observer.refresh()` yourself after layout shifts that do not resize `body`,
    such as late-loading images without set dimensions. Better: give every image
    `width`/`height` or `aspect-ratio`.
- **Scroll pipeline.** A plain `scroll` listener on `window` stores
  `scrollY`. It restarts a 500 ms "wake" timer that runs a rAF-driven ticker, which
  calls `handleScroll()` on every observer
  ([scroll.js L162-L170, L200-L210, L284-L298](https://github.com/juliangarnier/anime/blob/v4.5.0/src/events/scroll.js#L162-L298)).
  There is no wheel/touch interception and no smooth-scroll emulation. Native momentum
  is untouched. The ticker sleeps 500 ms after the last scroll event.
- **Default container is the window.** `container` defaults to `null`, which means
  `document.body` plus `window` scroll events
  ([docs: container](https://animejs.com/documentation/events/onscroll/scrollobserver-settings/container);
  [scroll.js L126, L315-L323](https://github.com/juliangarnier/anime/blob/v4.5.0/src/events/scroll.js#L315-L323)).
  If the page scrolls inside an inner `overflow: auto` element instead, the default
  observers never fire. See open [issue #1189](https://github.com/juliangarnier/anime/issues/1189).
  The desktop "phone-width column" layout **MUST** keep the window as the scroller.
  Put the blurred backdrop on a `position: fixed` layer. Do not make the column
  an overflow container.
- **Smoothing is optional.** `sync: 0..1` lerps the linked progress toward the scroll
  progress each frame (`lerp(.01, .2, value)`)
  ([scroll.js L881-L897](https://github.com/juliangarnier/anime/blob/v4.5.0/src/events/scroll.js#L881-L897);
  [docs: smooth scroll](https://animejs.com/documentation/events/onscroll/scrollobserver-synchronisation-modes/smooth-scroll)).
  This is a Lenis-like feel on the animation only; the page scroll stays native.
  Prefer `sync: true` on iOS. Momentum already supplies smoothness, and lerping adds lag.

WhatsApp context:

- On iOS, every in-app browser runs WebKit. WhatsApp opens links either in Safari or in
  an in-app WebKit view. An in-app view may have no collapsing toolbar at all, so
  `svh == lvh` there. The recipes above hold in both cases.
- On Android, links open in Chrome Custom Tabs or the default browser. Both are Blink with
  the same `svh`/`lvh` model.
- Not verified from a primary source: exact WhatsApp in-app browser behaviour per platform
  and version. It changes through A/B tests. Reports:
  [onlinemarketing.de](https://onlinemarketing.de/?p=392729),
  [Smartworld](https://www.smartworld.it/app/whatsapp-ab-testing-chrome-custom-tabs-488589.html).
  Test the Vercel preview from a real WhatsApp chat on one iPhone and one Android phone.

Keep the main-thread work small: scrubbed properties **SHOULD** be `opacity` and
transforms only. `onScroll` seeks on the main thread every frame. Native
`animation-timeline: scroll()` would run off-thread, but the plan locks anime.js.

## 4. `prefers-reduced-motion`

anime.js has no global reduced-motion switch. The documented v4 way is a `Scope` with
named media queries
([docs: mediaQueries](https://animejs.com/documentation/scope/scope-parameters/mediaqueries)):

- `createScope({ mediaQueries })` calls `matchMedia()` for each entry and listens for
  `change` ([scope.js L85-L91](https://github.com/juliangarnier/anime/blob/v4.5.0/src/scope/scope.js#L85-L91)).
- `self.matches.<name>` holds the current boolean inside `.add()` callbacks (L115).
- On `change`, the scope reverts everything it created and re-runs its constructors
  (L126-L143, L218-L224).
- `ScrollObserver`s register with the active scope
  ([scroll.js L417](https://github.com/juliangarnier/anime/blob/v4.5.0/src/events/scroll.js#L417)),
  so they are torn down and rebuilt too.

```js
createScope({
  mediaQueries: { reduceMotion: '(prefers-reduced-motion: reduce)' },
}).add((self) => {
  if (self.matches.reduceMotion) {
    // Plain fades only: no draw, no x/y, no scrubbing.
    document.querySelectorAll('[data-reveal]').forEach((el) =>
      animate(el, { opacity: [0, 1], duration: 400, autoplay: onScroll({ repeat: false }) }));
    // The bridge still pins via CSS; swap captions with one fade at mid-point.
    return;
  }
  buildBridge();
  buildTimeline();
  buildReveals();
});
```

Pair it with CSS for anything not driven by anime.js: an
`@media (prefers-reduced-motion: reduce)` block that drops `transition`s and the
hero video autoplay. Under reduced motion, show the timeline line fully drawn.

## 5. Import shape and tree-shaking in Vite

- `package.json` is `"type": "module"` and exposes ESM via `exports["."].import →
  ./dist/modules/index.js`. It also exposes subpaths: `animejs/animation`,
  `animejs/timeline`, `animejs/events`, `animejs/scope`, `animejs/svg`, `animejs/utils`
  and more. `"sideEffects"` lists only `./dist/modules/adapters/**` and `./src/adapters/**`
  ([package.json @ v4.5.0](https://github.com/juliangarnier/anime/blob/v4.5.0/package.json)).
  Every other module is side-effect-free and tree-shakes.
- The root re-exports every function by name
  ([src/index.js](https://github.com/juliangarnier/anime/blob/v4.5.0/src/index.js)).
  `createDrawable` is importable directly or as `svg.createDrawable`.
- The docs say anime.js has "excellent tree shaking support". Subpath imports matter only
  without a bundler ([docs: module imports](https://animejs.com/documentation/getting-started/module-imports)).

Use the root import in Vite:

```js
import { animate, createTimeline, onScroll, createScope, createDrawable, stagger } from 'animejs';
```

Measured with Vite 8.3.5 `vite build`, animejs 4.5.0:

| Entry | Minified | Gzip |
|---|---|---|
| The six named imports above, used | 53.75 kB | 20.53 kB |
| `import * as anime from 'animejs'` (everything) | 117.58 kB | 41.15 kB |

Named imports from the root halve the payload. Subpath imports gain nothing under Vite.

## Contradictions with the locked plan

None. "Scroll motion uses anime.js v4 `onScroll` only" holds, with two clarifications:

1. **Pinning is CSS `position: sticky`, not `onScroll`.** This is plain CSS, not another
   library, so the "no GSAP, no Lenis" lock is unaffected.
2. **The desktop layout must keep the window as the scroller.** A scrolling inner column
   breaks default `onScroll` observers (issue #1189), unless every observer is given
   `container`.

## Open risks to check on device

- Real WhatsApp in-app browsers on iOS and Android: toolbar behaviour and smoothness of
  the bridge crossfade during momentum scroll.
- Late-loading images above the bridge or timeline shift thresholds. Set image dimensions
  so `body` resizes at most once, or call `refresh()` after load.
