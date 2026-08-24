# WebTinyOne

Static **TinyOne** one-page marketing clone: HTML + custom CSS, **Font Awesome 5**, **Source Sans Pro** and **Sriracha**, matching a provided PSD.

**Author:** Mohammad Rohaan · [rohaan2802](https://github.com/rohaan2802)

---

## Table of contents

1. [Page structure (`index.html`)](#page-structure-indexhtml)
2. [Assets](#assets)
3. [How to run](#how-to-run)
4. [Editing](#editing)

---

## Page structure (`index.html`)

Document title in the extract: `Assignment...`. Favicon: `img/lock.png`.

### 1. Hero (`.main`)

- Nav: hamburger (`fa-bars`), brand **fingerprint + “tinyone”** (`#active`), socials: Facebook, Twitter, Google+, Pinterest  
- Headline: **“Inspire your inspiration”** + Lorem intro  
- CTA: **GET START**  
- Down arrow (`fa-long-arrow-alt-down`)

### 2. Features

- Heading **Tinyone features**  
- CSS **grid** of items, including:

| Icon | Card title |
|------|------------|
| tablet | Fully Responsive |
| lemon | Fully Layered PSD |
| folder | Font Awesome Icons |
| code | HTML3 & CSS3 |
| envelope | Email Template |
| (further cards in the rest of the file) | team / works / etc. |

Later sections in the full `index.html`: **team** portraits, **works** gallery, remaining marketing blocks — all wired to `img/` and `css/style.css`.

No JavaScript framework; layout is CSS + Font Awesome classes (`fas` / `far` / `fab`).

---

## Assets

```text
WebTinyOne/WebTinyOne/
├── index.html
├── css/style.css
├── css/font-Awesome/...
├── css/fonts/SourceSansPro-*.ttf
├── fonts/Sriracha-Regular.ttf
├── img/                 # hero, team, work, icons
└── Design/Tinyone.psd
```

This workspace may flatten `index.html` + `style.css` at `WebTinyOne/`.

---

## How to run

```bash
cd WebTinyOne   # or WebTinyOne/WebTinyOne
python -m http.server 5500
# http://localhost:5500/
```

Live Server is safer for font paths than `file://`.

---

## Editing

- Copy: `index.html`  
- Spacing/colors/breakpoints: `css/style.css`  
- Pixel reference: `Design/Tinyone.psd`  
- Swap `img/` files if filenames stay the same  

**Gaps vs a production template:** hamburger has no JS drawer; CTA `href="#"`; lorem ipsum throughout.

Before commercial use, confirm TinyOne / font / icon licenses.

---

## Author

**Mohammad Rohaan** · [rohaan2802](https://github.com/rohaan2802)
