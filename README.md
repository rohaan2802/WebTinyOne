# WebTinyOne

Static **TinyOne** marketing landing page clone built with HTML and custom CSS (Font Awesome + Source Sans / Sriracha fonts). Single-page layout: hero, features grid, team, works, and supporting sections matching the provided PSD design.

---

## Overview

`WebTinyOne` recreates the TinyOne one-page template as a front-end practice project. The hero brand mark uses a fingerprint icon with the **tinyone** wordmark, followed by feature cards (responsive, layered PSD, icons, HTML/CSS, email template, and more), imagery, and team/work galleries.

---

## Features

- Full-bleed hero with CTA ("GET START") and social icon row
- Features section with Font Awesome icon grid
- Team and work galleries from `img/`
- Custom webfonts (`SourceSansPro`, `Sriracha`) and Font Awesome 5 assets
- Design source: `Design/Tinyone.psd`

---

## Repository structure

```text
WebTinyOne/
└── WebTinyOne/
    ├── index.html
    ├── css/
    │   ├── style.css
    │   ├── font-Awesome/...
    │   └── fonts/SourceSansPro-*.ttf
    ├── fonts/Sriracha-Regular.ttf
    ├── img/                 # hero, team, work, icons
    └── Design/Tinyone.psd
```

---

## Build / run

No build toolchain required.

```bash
cd WebTinyOne/WebTinyOne
python -m http.server 5500
# open http://localhost:5500/
```

Or open `WebTinyOne/index.html` directly in a browser (Live Server recommended so font paths resolve consistently).

---

## Usage

- Edit copy and section order in `index.html`.
- Tune spacing, colors, and breakpoints in `css/style.css`.
- Swap images under `img/` while keeping filenames or updating `src` attributes.
- Use `Design/Tinyone.psd` as the visual reference when refining layout fidelity.

---

## Extending

- Add a mobile nav drawer for the hamburger icon.
- Extract CSS custom properties for brand colors/fonts.
- Split long `index.html` sections into partials if moving to a static site generator.
- Add subtle scroll animations while keeping the static, no-framework approach.

---

## License

Practice clone of a public template design - verify TinyOne / asset licensing before commercial use.
