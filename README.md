# Tinyone · Responsive front-end study

A polished recreation of the classic **Tinyone** one-page template by **Mohammad Rohaan**, rebuilt as an accessible, interactive, portfolio-ready front-end demonstration. The project keeps the original creative direction while adding theme switching, gallery tools, keyboard-friendly image viewing, motion controls, and documented verification.

## LIVE DEMO

https://rohaan2802.github.io/WebTinyOne/

Related docs: [CASE_STUDY.md](CASE_STUDY.md) · [RESPONSIVE_QA.md](RESPONSIVE_QA.md)

---

## Feature screenshots

Below are **15 desktop feature screenshots**. Each crop focuses on one capability (not full-page mobile frames).

### 1. Hero landing

Full first viewport: brand header, eyebrow, headline, supporting copy, primary/secondary CTAs, and scroll cue.

![Hero landing](docs/screenshots/01-hero-landing.png)

### 2. Navigation and theme toggle

Main nav links (Features, Pricing, Our work, Contact, The build) plus the light/dark theme control.

![Navigation and theme](docs/screenshots/02-navigation-theme.png)

### 3. Features section

Icon + copy cards explaining responsive layout, HTML5 foundations, creativity, and accessibility-minded structure.

![Features section](docs/screenshots/03-features-section.png)

### 4. Pricing plans

Three illustrative plans with featured emphasis, pricing figures, plan bullets, and contact CTAs.

![Pricing plans](docs/screenshots/04-pricing-plans.png)

### 5. Work gallery

Portfolio grid with category filters and project cards ready for image viewing.

![Work gallery](docs/screenshots/05-work-gallery.png)

### 6. Gallery filter (active)

Clicking **Portraits** (or another category) updates `aria-pressed`, status text, and visible cards only.

![Gallery filter active](docs/screenshots/06-gallery-filter-active.png)

### 7. Accessible image viewer

Opening a project preview launches a `<dialog>` image viewer with title, position, previous/next, and Escape/Close.

![Image viewer](docs/screenshots/07-image-viewer.png)

### 8. Team section

Sample people cards with portrait, name, role, and short bio (illustrative template content).

![Team section](docs/screenshots/08-team-section.png)

### 9. Story and statistics

Demonstration stats strip (products, hours, customers, ideas) under the story heading.

![Story and stats](docs/screenshots/09-story-stats.png)

### 10. Contact form

Contact details beside a local demo form (name, email, message) with client-side validation feedback.

![Contact form](docs/screenshots/10-contact-form.png)

### 11. Project notes (The build)

Portfolio-facing project narrative: scope, stack, interaction goals, and source links.

![Project notes](docs/screenshots/11-project-notes.png)

### 12. Native FAQ details

Expandable `<details>` / `<summary>` FAQ for scope, testing, and how to run the project—no custom accordion library.

![FAQ details](docs/screenshots/12-faq-details.png)

### 13. Reading progress

A thin top progress bar tracks scroll depth (shown here over the site header). A floating back-to-top control also appears after scrolling on the live page.

![Reading progress](docs/screenshots/13-reading-progress.png)

### 14. Light theme hero

Same landing composition with the high-contrast light palette (saved preference restores on reload).

![Light theme hero](docs/screenshots/14-light-theme-hero.png)

### 15. Footer and newsletter

Footer brand, nav, attribution, and newsletter demo field with local validation only.

![Footer newsletter](docs/screenshots/15-footer-newsletter.png)

---

## Overview

Tinyone is a **static** HTML/CSS/JavaScript site. There is no framework runtime and no application build step for the public page. The goal is to show:

- Clean semantic structure
- Responsive composition across widths
- Thoughtful interaction (theme, filters, viewer, progress)
- Progressive enhancement when JavaScript or storage is limited
- Portfolio documentation that explains what was built and why

Sample team, pricing, statistics, and testimonial copy is **illustrative**. Forms validate in the browser but do not send or store submissions.

---

## Features explained in depth

### 1. Hero / landing

The first viewport establishes brand presence with eyebrow text, a large fluid headline, supporting paragraph, and CTAs. Typography uses `clamp()` so the hero stays balanced from mid-width to large desktop without awkward wrapping. Dark mode uses yellow accent headlines; light mode keeps near-black type on a bright yellow plane for maximum visibility.

### 2. Navigation and theme toggle

Primary anchors jump to Features, Pricing, Work, Team, Story, Contact, and The build. On narrower widths the menu collapses before links crowd. The theme button toggles `data-theme` on `<html>`, updates its icon/label, and writes `WebTinyOne-theme` to `localStorage`. `theme-init.js` restores the preference before first paint to reduce flash. If storage is blocked, the session still toggles normally.

### 3. Features section

Six feature articles use icon + heading + paragraph to communicate product strengths (responsive layout, HTML5 foundations, creativity, accessibility-minded structure, and related points). Cards keep consistent rhythm and remain readable in both themes.

### 4. Pricing plans

Illustrative plan cards support comparison UX. A featured plan is emphasized with a stronger border/shadow treatment without hiding alternatives. Prices and bullets are demo content only.

### 5. Work gallery

A responsive project grid shows imagery, titles, and category metadata (`Portraits`, `Creative studies`). Cards remain usable as normal links when JavaScript is unavailable (progressive enhancement).

### 6. Gallery filters

Filter chips use `aria-pressed` and a live status line (`Showing X of Y projects`). Filtering only hides cards; it does not destroy DOM nodes, so keyboard order and viewer indexing stay predictable.

### 7. Accessible image viewer (`<dialog>`)

Project previews open a native dialog viewer with:

- Current image and title
- Position indicator (for example `1 / 8`)
- Previous / next controls
- Close button and Escape
- Backdrop dismiss
- Body scroll lock while open

Without the dialog API / JS, preview links still behave as normal image links.

### 8. Team section

People cards with portrait, name, role, and short bio provide a social-proof block. Content is illustrative template data for portfolio presentation.

### 9. Story and statistics

A narrative story block is paired with a stats strip (products, hours, customers, ideas) for quick scanning of scale/outcomes.

### 10. Contact form

Contact details sit beside a local demo form (name, email, message). Validation runs in the browser with status messaging (`aria-live`). Nothing is POSTed or stored — production needs a backend or form service.

### 11. Project notes (The build)

Portfolio-facing documentation inside the page itself: scope, stack, interaction goals, and links. Useful for recruiters who open the live demo first.

### 12. Native FAQ details

FAQ entries use native `<details>` / `<summary>` so they work without a custom accordion library and remain accessible with keyboard and assistive tech defaults.

### 13. Reading progress and back-to-top

`presentation.js` scales a thin top progress bar with scroll depth (decorative, `aria-hidden`). After scrolling, a floating back-to-top control returns users to the hero with focus-friendly navigation.

### 14. Light theme contrast

Light mode prioritizes maximum visibility: near-black ink, slate borders, white cards, indigo buttons, and high-contrast inputs/filters so washed-out gray-on-white UI is avoided.

### 15. Footer and newsletter

Footer brand, nav, attribution, and a newsletter demo field with local validation only. Same no-server rule as the contact form.

### Responsive composition

Layouts use fluid type, flexible grids, and a wrapping header. Images stay max-width constrained. Content is not locked into fixed viewport heights that clip on short screens.

### Active section indication

As the user scrolls, presentation logic can highlight the current section context for orientation (paired with smooth scrolling and scroll padding).

### Considered motion

Entrance/reveal motion is short and cancellable. When the OS requests reduced motion, reveals and hover movement settle so content remains usable without animation.

### Progressive enhancement

- Skip link to main content
- Visible keyboard focus
- No-JS navigation and image links still work
- Theme fallback when `localStorage` throws
- Reduced-motion path when preferred

### Theme contrast summary

| Mode | Goal | Key choices |
| --- | --- | --- |
| Light | Maximum visibility | Near-black text, strong borders, white surfaces, indigo CTAs, clear inputs |
| Dark | High-contrast night UI | Deep base, bright yellow accents, light body text, stronger form borders |

---

## Tech stack

| Layer | Choice |
| --- | --- |
| Markup | Semantic HTML5 |
| Styling | Plain CSS (`style.css`, `enhancements.css`, `presentation.css`) |
| Behavior | Vanilla JavaScript modules/scripts |
| Assets | Local fonts, icons (Font Awesome), and images |
| Hosting | GitHub Pages |
| Checks | Playwright-driven Python regression script |

---

## Source map

| File | Responsibility |
| --- | --- |
| `index.html` | Page structure, sections, FAQ, dialog viewer shell |
| `css/style.css` | Base layout, light palette tokens, grids |
| `css/enhancements.css` | Theme system, gallery tools, viewer, high-contrast overrides |
| `css/presentation.css` | Presentation typography and motion-related polish |
| `theme-init.js` | Early theme application from storage |
| `script.js` | Navigation menu + demo form validation |
| `enhancements.js` | Theme toggle, filters, image viewer, back-to-top |
| `presentation.js` | Reveals, reading progress, section awareness, FAQ motion hooks |
| `docs/screenshots/` | Feature screenshots used in this README |
| `tests/responsive_check.py` | Multi-width / theme regression checks |
| `CASE_STUDY.md` | Design decisions |
| `RESPONSIVE_QA.md` | Verification notes and limits |

---

## Run locally

From the repository root:

```sh
python -m http.server 5500
```

Open http://localhost:5500

Any static host can serve the same files. For GitHub Pages, the live URL is listed under **LIVE DEMO** above.

---

## Verification

The browser regression check covers **24 widths from 240px to 3840px in both themes**, plus landscape, enlarged text, gallery keyboard behavior, theme persistence, native FAQ, reduced motion, and no-JavaScript navigation. See [RESPONSIVE_QA.md](RESPONSIVE_QA.md).

```sh
python -m pip install playwright
python tests/responsive_check.py
```

Chrome is the default channel. Set `BROWSER_CHANNEL=msedge` to use Edge. Artifacts write to ignored `tests/artifacts/`.

Optional local screenshot helper used for this README:

```sh
node scripts/capture-feature-shots.mjs
```

---

## Attribution and scope

This is an independent front-end study of an existing template, not a claim of an original commercial product or a shipped client project. Original imagery, fonts, and design attribution are retained—review licenses before commercial reuse.

No analytics, checkout, or performance score is claimed. Tests do not certify every physical device or assistive technology.

---

## Author

**Mohammad Rohaan** · [GitHub](https://github.com/rohaan2802)

Repository: https://github.com/rohaan2802/WebTinyOne
