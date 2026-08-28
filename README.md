# WebTinyOne

### 🚀 [CLICK HERE TO VIEW LIVE DEMO](https://rohaan2802.github.io/WebTinyOne/)

Static one-page **TinyOne** marketing clone: HTML5 + custom CSS, **Font Awesome 5**, and **Source Sans Pro**, laid out to match `Design/Tinyone.psd`. There is no JavaScript framework and no backend; every section is markup plus CSS Grid / Flexbox.

**Author:** Mohammad Rohaan · **Roll:** 22I-2327 · **GitHub:** [rohaan2802](https://github.com/rohaan2802)

---

## Table of contents

1. [Problem and context](#problem-and-context)
2. [Page structure (`index.html`)](#page-structure-indexhtml)
3. [CSS layout (`style.css`)](#css-layout-stylecss)
4. [Fonts and Font Awesome](#fonts-and-font-awesome)
5. [Repository structure](#repository-structure)
6. [How to open and run](#how-to-open-and-run)
7. [Constants and colours](#constants-and-colours)
8. [Limitations](#limitations)
9. [Author](#author)

---

## Problem and context

This repository is a front-end assignment that rebuilds a TinyOne-style landing page from a Photoshop document (`WebTinyOne/Design/Tinyone.psd`). The HTML document title is `Assignment...`. Copy throughout is **Lorem ipsum**; social and CTA links are `href="#"`. The page is a visual clone, not a working product site.

The working copy may flatten `index.html` and `style.css` at the folder root. On GitHub the live paths are nested under `WebTinyOne/`.

---

## Page structure (`index.html`)

Head loads `./css/style.css`, `./css/font-Awesome/css/all.css`, viewport meta, and favicon `./img/lock.png`.

### 1. Hero (`.main`) — comment “First Area”

| Element | Markup |
|---------|--------|
| Hamburger | `<i class="fas fa-bars">` (no drawer script) |
| Brand | `<i class="fas fa-fingerprint" id="active"> tinyone </i>` |
| Social | Facebook, Twitter, Google+, Pinterest (`fab` icons, `href="#"`) |
| Headline | **Inspire your inspiration** |
| CTA | **GET START** |
| Scroll cue | `fas fa-long-arrow-alt-down` |

### 2. Features (`.features` + `section.grid`)

Heading **Tinyone features**. Six `.item` cards:

| Icon class | Title |
|------------|--------|
| `fas fa-tablet-alt` | Fully Responsive |
| `far fa-lemon` | Fully Layered PSD |
| `far fa-folder` | Font Awesome Icons |
| `fas fa-code` | HTML3 & CSS3 |
| `far fa-envelope` | Email Template |
| `far fa-bookmark` | Free to Download |

### 3. Pricing (`.freetrial`) — “Third Area”

Heading **Pricing And Free Trial**. Three plan icons (tablet / laptop / desktop) labelled **Basic**, **Standard**, **Enterprice** (spelling as in the HTML). Price tiles:

| Price | Period | Button |
|-------|--------|--------|
| FREE | free forever | GET FREE NOW |
| $99 | month | UPGRADE |
| $199 | month | LEARN MORE |

### 4. Our Works (`section.work` → inner `section.team`)

Eight `<figure>` tiles. Captions reuse feature titles; category lines are Design / Branding or App design / development.

| File | Caption title |
|------|----------------|
| `img/team-1.jpg` | Fully Responsive |
| `img/team-2.jpg` | Font Awesome Icons |
| `img/team-3.jpg` | HTML3 & CSS3 |
| `img/team-4.jpg` | Various Layouts |
| `img/v4.jpg` | Fully Responsive |
| `img/a6.jpg` | Font Awesome Icons |
| `img/c2.jpg` | HTML3 & CSS3 |
| `img/c3.jpg` | Various Layouts |

Hover uses an empty `<figcaption>` overlay (red tint in CSS).

### 5. Our team (`section.team_work` → `.our_team`)

All four people are labelled **UI Designer**. Socials: Facebook, Twitter-square, LinkedIn (`href="#"`).

| Image | Name |
|-------|------|
| `img/work 1.jpg` | Rurh Woods |
| `img/work 2.jpg` | Timothy Read |
| `img/work 3.jpg` | Little Hearts |
| `img/work 4.jpg` | John Doe |

### 6. Stats and testimonial (`section.stats`, `.john_doe`, `.paragraph`)

Heading **Stats & Testimonial**.

| Icon | Number | Label |
|------|--------|--------|
| `fa-puzzle-piece` | 20 | Products |
| `fa-cloud-download-alt` | 120,000 | Downloads |
| `fa-users` | 1200 | Customers |
| `fa-thumbs-up` | 900 | Like |

Testimonial portrait `img/john 1.jpg`, name **John Doe**, affiliation **From Wooodpress**, quote wrapped in `fa-quote-left` / `fa-quote-right`.

### 7. Contact (`.contact`, `.address`, `form.forms`)

Heading **Keep in touch with us**.

| Icon | Label | Value |
|------|--------|--------|
| `fa-map-marker-alt` | Address | 66, Dang Van ngu, Dong Da, Ha noi, Vietnam |
| `fa-envelope` | E-Mail | contact@halovietnam.com |
| `fa-phone-square-alt` | Phone | +92 3110433555 |

Form fields: email, full name, message `<textarea>`, **Send Message** as `type="button"` (does not submit).

### 8. Newsletter footer (`.blacky`)

Heading **Sign up for our newsletter**. Email + **Submit**. Five `.texts` columns: HALOVIETNAM LTD contact block; Examples / Shop / License; Contact / About / Privacy / Terms; Download / Support / Documents; Media / Blog / Forums.

---

## CSS layout (`style.css`)

Global reset: `body` margin/padding 0, `* { box-sizing: border-box }`.

| Selector | Layout |
|----------|--------|
| `nav` | **Flex**, `justify-content: space-evenly`, 30px type, 60px top padding |
| `.grid` (features) | **Grid** `repeat(3, 1fr)`, 80% width, 55px gap |
| `.item` | Nested 3-column grid for icon + `.texture` |
| `.container` (pricing) | Grid `repeat(3, 1fr)` — six children (3 plans + 3 prices) |
| `.team` (works) | Grid `repeat(4, 1fr)`, 80% width, 100px row gap |
| `.our_team` | Grid `repeat(4, 1fr)`, 75% width |
| `.puzzle` (stats) | Grid `repeat(4, 1fr)`, 50% width |
| `.paragraph` | Grid `repeat(3, 1fr)` for quotes + text |
| `.address` | Grid `repeat(3, 1fr)`, 60% width |
| `.grids` (footer) | Grid `repeat(5, 1fr)`, 80% width, 120px column gap |

Hero `.main` is `height: 720px`, background `#fcdb00`. Figure overlay `#e845459f`, opacity 0 → 1 on hover (`transition: 0.5s`). Team portraits `border-radius: 50%` at 50% width. Contact inputs are 500px wide, black 2px border. Footer `.blacky` is `height: 600px`, black background.

**There are no `@media` queries in `style.css`.** Layout is desktop-first CSS Grid only.

---

## Fonts and Font Awesome

`@font-face` families in CSS:

| Family name in CSS | File |
|--------------------|------|
| `bold` | `./fonts/SourceSansPro-Bold.ttf` (relative to `css/style.css` → `css/fonts/`) |
| `regular` | `./fonts/SourceSansPro-Regular.ttf` |

TREE also lists `WebTinyOne/fonts/Sriracha-Regular.ttf`. That file is **not** referenced by an `@font-face` in `style.css`.

Font Awesome 5 webfonts (brands, regular, solid) live under `css/font-Awesome/webfonts/` (`eot`, `svg`, `ttf`, `woff`, `woff2`). HTML uses `fas` / `far` / `fab` classes.

---

## Repository structure

```text
WebTinyOne/
├── index.html
├── css/
│   ├── style.css
│   ├── fonts/SourceSansPro-Bold.ttf
│   ├── fonts/SourceSansPro-Regular.ttf
│   └── font-Awesome/css/all.css + webfonts/
├── fonts/Sriracha-Regular.ttf
├── img/
└── Design/Tinyone.psd
```

This workspace may flatten `index.html` + `style.css` at `WebTinyOne/`. Relative paths in HTML still assume the nested `css/` and `img/` layout.

Language (GitHub): CSS. Default branch: `main`.

---

## How to open and run

From the folder that contains `index.html` **and** the `css/` + `img/` directories:

```bash
cd WebTinyOne/WebTinyOne
python -m http.server 5500
```

Open [http://localhost:5500/](http://localhost:5500/).

Alternatively double-click `index.html` (`file://`). Fonts are more reliable over HTTP (Live Server is fine). Edit copy in `index.html`, layout in `css/style.css`, pixels against `Design/Tinyone.psd`; keep `img/` filenames if you swap photos.

---

## Constants and colours

| Token | Value |
|-------|--------|
| Hero / brand yellow | `#fcdb00` |
| Near-black text | `#222222` |
| Muted body copy | `#a8a8a8` |
| Standard plan icon fill | `#010101` |
| Hover overlay | `#e845459f` |
| Form / footer black | `#000` / footer height 600px |
| Hero height | 720px |
| Feature grid | 3 columns |
| Works / team | 4 columns |
| Footer columns | 5 |

---

## Limitations

- Hamburger icon has **no** JavaScript drawer.
- All CTAs and socials are `href="#"`; the contact button is `type="button"` with no handler.
- Body copy is lorem ipsum; “HTML3 & CSS3”, “Enterprice”, and “Wooodpress” are as authored.
- No media queries — grids will squeeze on small viewports.
- `img/user.png` is unused. `Sriracha-Regular.ttf` is unused by CSS.
- Confirm TinyOne / Font Awesome / Source Sans Pro licences before any commercial reuse.

---

## Author

**Mohammad Rohaan** · Roll **22I-2327** · [github.com/rohaan2802](https://github.com/rohaan2802)
