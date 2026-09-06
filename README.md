# WebTinyOne

A responsive refresh of the original one-page design, recreated by **Mohammad Rohaan**.

[Live demo](https://rohaan2802.github.io/WebTinyOne/) · [Source](https://github.com/rohaan2802/WebTinyOne)

## Run locally

From this repository’s root, run `python -m http.server 5500`, then open http://localhost:5500. No build step, package install, or framework is required.

## Dark theme and interactive features

- Dark is the default, including when JavaScript is disabled. A header control switches to the original light palette.
- The preference is saved locally per site and applied before rendering; blocked browser storage falls back to a session-only switch.
- Portfolio filters update the visible collection and announce the result count.
- Images open in a responsive modal with next/previous controls, arrow keys, Tab cycling, Escape to close, and focus returned to the selected image. Without JavaScript or dialog support, image links open directly.
- A back-to-top control appears after scrolling and respects reduced-motion preferences.
- No new runtime dependencies or remote services are required. `theme-init.js` runs before styles; `enhancements.js` and the component stylesheet contain the optional interactions.

## What changed

- Fluid typography and bounded content widths, with content-driven grids for compact phones, tablets, desktop, and wide displays.
- Mobile navigation with expanded state, Escape handling, focus management, and a usable no-JavaScript fallback.
- Refined spacing, image proportions, visual hierarchy, color contrast, and visible keyboard focus.
- Semantic sections, one page heading, image descriptions and dimensions, lazy loading, and reduced-motion support.
- Real section links and a source-code download, replacing empty placeholder links.
- Self-hosted fonts with corrected paths and swap rendering; no third-party runtime dependencies.

## Content and limitations

This is a front-end template demonstration. Team content, portfolio captions, pricing, statistics, and testimonials are illustrative. Contact and newsletter forms validate input locally and explicitly report that nothing is sent or stored. A real backend or form service is required before collecting submissions.

Existing images, fonts, and original design assets are retained. Review their respective licenses before commercial reuse. No analytics or payment processing is included.

## Responsive verification

See `RESPONSIVE_QA.md` for the tested viewport matrix and interaction checks. Layouts adapt by available space rather than device brand. Finite browser tests cannot guarantee every physical device; test target devices before a production launch.
