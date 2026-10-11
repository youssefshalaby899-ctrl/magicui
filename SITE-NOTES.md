# MANKIND — site notes

A single-file, art-directed website for **MANKIND** (*The Mankind Barber*,
[@mankindegypt](https://www.instagram.com/mankindegypt)) — One Golden Square,
New Cairo.

**Deliverable:** [`index.html`](./index.html) — 161 KB, self-contained.
Save it anywhere and double-click it. No build step, no server, no `npm install`.
It works over `file://` as well as over HTTP.

---

## 1 · Repository audit

The checkout is `magicuidesign/magicui`: a pnpm + Turbo monorepo whose only app
(`apps/www`) is a **Next.js 15 / React 19 / Tailwind 4 / Motion** documentation
site for a component registry (79 components in `apps/www/registry/magicui`).

That stack is the decisive constraint. Nothing in `apps/www` renders without
React, a Tailwind build and a Node server — so no React component can be dropped
into a file the user saves and opens locally. Every library below was judged
against that, not against "is it good".

| Repository | Verdict | Reasoning |
|---|---|---|
| **darkroomengineering/lenis** `v1.3.26` | ✅ **Used — vendored inline** | MIT. Ships a framework-agnostic IIFE (`dist/lenis.min.js`, 18.7 KB) that assigns `globalThis.Lenis`. Zero dependencies, no build step, works from `file://`. Inlined verbatim (only the `sourceMappingURL` comment was dropped). |
| **formkit/auto-animate** `v0.10.0` | ✅ **Used — vendored inline** | MIT, 8.4 KB, zero dependencies. Genuine zero-config FLIP for add/remove/reorder of children — exactly what the gallery filter needs. Only change: the trailing `export{…}` became a `window` shim so an inline ES module can consume it. |
| **greensock/GSAP** `v3.15.0` | ❌ **Skipped** | Would need `gsap` + `ScrollTrigger` + `SplitText` ≈ 150 KB inlined, a 3× increase in JS for this page. Every effect it was wanted for has a free native equivalent: `animation-timeline: view()` for the scroll-linked rail and parallax, `IntersectionObserver` for reveals, and ~25 lines for word splitting. Licence is a "no-charge" custom licence rather than OSI, so vendoring it into a saved-and-shared HTML file is also the murkiest option here. |
| **DavidHDev/react-bits** | ⚠️ **Patterns only** | 200+ JSX components across `src/content/{TextAnimations,Animations,Components,Backgrounds,Micro}`. React-only, so incompatible with a no-build file — but the *recipes* are portable. Ten were re-implemented by hand (below). |
| **magicuidesign/magicui** (this repo) | ⚠️ **Patterns only** | Same reason: React + Tailwind + Motion. Nine registry components were ported to vanilla CSS/JS (below). |
| **pmndrs/react-three-fiber** | ❌ **Skipped** | Requires React and `three` (~600 KB). A WebGL scene buys nothing for a barbershop and costs LCP, memory and battery on exactly the mid-range Android devices most of this business's traffic arrives on. |
| **pmndrs/drei** | ❌ **Skipped** | Depends on R3F; skipped with it. |
| **theatre-js/theatre** | ❌ **Skipped** | It is a motion-design *editor*, not a component library: React, a bundler, and persisted project state. Last push Aug 2024. Authoring tooling has no place in a static one-file deliverable. |

Net: **2 of 7 libraries installed**, 26 KB of vendored JS total, and the page
still animates fully with both of them stripped out.

### Effects ported by hand (0 KB each)

From **magicui**: `blur-fade`, `text-animate` (line-masked word rise),
`marquee`, `noise-texture`, `scroll-progress`, `interactive-hover-button`,
`magic-card` (pointer spotlight), `shine-border`, `number-ticker`.

From **react-bits**: `ScrollReveal` (word-wise), `MaskedHeading`,
`SpotlightCard`, `GlareHover`, `TiltedCard`, `Magnet`, `Noise`, `LightRays`,
`ScrollVelocity`, `CardSwap`, `StaggeredMenu`, `GlowCursor`, `CountUp`.

---

## 2 · Art direction

Deliberately **not** the dark-purple-gradient-with-glass-cards look that
signals "generated". The reference is 1930s Cairo Art Deco crossed with a
barber's price ledger.

- **Palette** — obsidian `#0A0908`, smoke `#171412`, bone `#EFE7D8`,
  brass `#C9A227 → #E7CE8B`, ember `#B4472C` (used only for error states).
- **Type** — *Bodoni Moda* (display didone, italic for a single accent word per
  heading), *Archivo* (body grotesque), *IBM Plex Mono* (eyebrows, prices,
  times, durations). Tabular figures keep the ledger columns aligned.
- **Motifs** — 1 px brass hairlines that draw themselves in; the Deco arch as an
  image mask; dot-leader ledger rows instead of card boxes; a film grain and
  vignette over the whole page; corner ticks framing the hero.
- **Photography** — Pexels CDN, duotone-graded in CSS (`grayscale` + `sepia` +
  `contrast`) so mixed sources read as one shoot, and returning to full colour
  on hover. Every image sits in a `.ph` wrapper that degrades to an
  art-directed brass pattern with the wordmark if the CDN is unreachable.

---

## 3 · Motion budget

Each effect earns its place and is switched off where it costs more than it gives.

| Feature | Mechanism | Cost |
|---|---|---|
| Cinematic hero | line-masked H1 rise, Ken Burns, brass light rays, grain | compositor transforms + gradients only — no `blur()` filters |
| Smooth scroll | Lenis | 18.7 KB, desktop fine pointers only |
| Scroll reveals | one shared `IntersectionObserver` | ~0 |
| Word-wise manifesto | rAF, only while the block is on screen | ~0 |
| Scroll-linked rail + parallax | native `animation-timeline: view()` where supported, rAF fallback otherwise | 0 KB in Chrome/Safari 26+ |
| Gallery filter | AutoAnimate FLIP | 8.4 KB |
| Interactive service rows | pointer spotlight via CSS vars, expanding panel (`grid-template-rows: 0fr → 1fr`), cursor-following preview | rAF-throttled |
| Hover refinement | magnetic buttons, brass fill wipes, shine-border sweep | rAF loops that **stop when settled** |
| Page transitions | curtain intro on first visit only (`sessionStorage`), razor-line wipe on in-page navigation | one-shot |

Scroll work is funnelled through **one** rAF ticker and **one** `IntersectionObserver`.
Every rAF loop (cursor, magnet, peek, count-up) terminates when it settles
instead of idling forever.

### Mobile

- Lenis is disabled on `(pointer: coarse)` — native iOS/Android momentum feels
  better than any emulation.
- The two full-viewport `mix-blend-mode` layers (grain animation, light-ray
  drift) are frozen on touch. They repaint the whole screen per frame and buy
  nothing without a cursor.
- The nav's `backdrop-filter` is applied on `(pointer: fine)` only; on touch the
  bar goes near-opaque instead, so scrolling never re-blurs a full-width strip.
- The cursor-following service preview is suppressed under 1180 px.
- All 15 below-the-fold images are `loading="lazy"` with explicit `width`/`height`
  (no CLS); only the hero is eager, with `fetchpriority="high"` and a `<picture>`
  that drops to a 760 px crop on phones.

---

## 4 · Accessibility

- `prefers-reduced-motion: reduce` is honoured in **both** CSS (a global block
  that collapses durations and force-shows every hidden state) and JS (Lenis,
  parallax, grain, Ken Burns, curtain, magnetic buttons, custom cursor and the
  quote auto-advance are all skipped). AutoAnimate also respects it natively.
- Skip link, real landmarks, one `h1`, no heading-level skips.
- The curtain has a **CSS failsafe animation**: if the script never executes, it
  clears itself at 2.6 s rather than trapping the page.
- Overlays (`sheet`, lightbox) set `inert` on the page behind them, trap focus,
  and close on `Escape` with focus restored to the trigger.
- Service rows are real `<button>`s with `aria-expanded` / `aria-controls` /
  `role="region"`; filter chips use `aria-pressed`; quote dots use
  `aria-current`; the gallery and quote stack are swipeable *and* fully
  keyboard-operable.
- `matchMedia` is feature-detected, so a WebView without it degrades to
  "motion allowed, coarse pointer" instead of throwing.

## 5 · No-JS behaviour

Reveals, line masks, tile wipes, word-wise text and the drawn rail all have
`<noscript>` overrides, so every word, price, hour and photograph is present
without JavaScript. Only the lightbox, filters, curtain and form need it — and
the booking path is a `wa.me` link either way.

---

## 6 · Verification

| Suite | Checks | Result |
|---|---|---|
| Runtime / interaction (JSDOM, scripts enabled) | 39 | ✅ pass, 0 runtime errors |
| `prefers-reduced-motion: reduce` forced on | 19 | ✅ pass, 0 runtime errors |
| No JavaScript at all, over a `file://` origin | 17 | ✅ pass |
| HTML lint — unique ids, anchor targets, `aria-controls`, `label[for]`, button `type`, img `alt`, `aria-hidden` on focusables | 7 groups | ✅ 0 issues |
| CSS — `css-tree` parse | 440 rules / 1 577 declarations | ✅ 0 parse errors |
| JS — `node --check` on every script block | 3 | ✅ pass |
| JSON-LD (`BarberShop` LocalBusiness) | 1 | ✅ valid |

---

## 7 · Before launch — placeholder data to replace

Everything below is invented or approximated and is flagged in the HTML comment
at the top of `index.html`:

- **Hours** — the `table.hours` rows. The current day is highlighted at runtime.
- **Prices** — the ledger markup and the matching `<select>` options (EGP).
- **Stats** — years, cuts delivered, barbers, guest average.
- **Testimonials** — the `QUOTES` array in the script.
- **Craft cards** — role titles and copy in `#crew`.
- **Photography** — Pexels CDN placeholders; swap for real Mankind shots
  (the `.ph` wrapper means nothing breaks while you do it one at a time).
- **`hello@mankind.eg`** — unverified; confirm or remove.
- **Verified from public listings:** `+20 11 4831 0107`, One Golden Square,
  New Cairo, `@mankindegypt`, facebook.com/MankindGentsSalon.

`index.html` at the repository root is inert to the Turbo/Next build in
`apps/www` — nothing in the monorepo reads it.
