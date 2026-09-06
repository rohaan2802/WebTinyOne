# Responsive verification

Tested on 6 September 2026 using headless Google Chrome, with additional Microsoft Edge accessibility checks.

## Layout matrix

The entire 24-width matrix passed in **both dark and light themes** (48 theme/width combinations per site).

- Widths (CSS pixels): 240, 280, 320, 360, 375, 390, 414, 520, 540, 600, 640, 760, 768, 820, 912, 960, 961, 1000, 1024, 1280, 1440, 1920, 2560, 3840.
- Landscape: 568 × 320, 844 × 390, 1024 × 768.
- Enlarged root text: 36px at a 320px viewport (twice the new 18px baseline).
- No horizontal page overflow or elements extending beyond the viewport in the width matrix.
- All content images decoded successfully; no browser script errors or local HTTP failures.
- Full-page screenshots reviewed at phone, tablet, and desktop widths.

## Interaction checks

- Mobile menu opens and closes, exposes its expanded state, closes with Escape, and returns focus to the toggle.
- Section navigation closes the mobile menu and moves focus to the destination.
- Skip link moves keyboard focus to main content.
- Reduced-motion preference disables smooth scrolling.
- Navigation remains available without JavaScript; demo form controls remain disabled to prevent accidental submission.
- Tinyone contact and newsletter demos validate inputs and show accurate local-only status messages.

## Presentation verification

- Baseline body text is at least 18px with standard browser settings.
- Updated mobile navigation is tested on both sides of the 960px breakpoint.
- Native project FAQ opens from the keyboard.
- Current-section navigation identifies the project section after scrolling.
- Enabling reduced motion leaves no running reveal animation; content remains readable.
- One-time motion, larger text, and new project notes are included in the dark/light layout matrix.

## New feature verification

- Theme switches in both directions and persists after reloading.
- With browser storage blocked, the page loads in dark mode and still switches themes.
- Category filters show the expected subset and restore all eight projects.
- Image viewer tested at 240px, 320px, 768px, 1440px, and 568 × 320 landscape: image decoding, next/previous arrows, constrained width, Tab focus containment, Escape closing, and focus restoration pass.
- Back-to-top returns to the page start and focuses the brand link.
- No-JavaScript mode keeps the dark theme, full gallery, and navigation; enhancement-only controls stay hidden.

## Automated accessibility audit

Axe-core 4.10.3 in Microsoft Edge reported zero violations for WCAG 2 A/AA and WCAG 2.1 AA rule tags at 320px, 768px, and 1440px in both themes, with the normal page and the image viewer open (12 states per site). This automated result is not a complete accessibility certification.

## Run the regression check

Requires Python, the Playwright Python package, and an installed Google Chrome browser:

```sh
python -m pip install playwright
python tests/responsive_check.py
```

The test starts a temporary local server automatically and saves screenshots and JSON results in ignored `tests/artifacts/`. Set the `BROWSER_CHANNEL` environment variable to `msedge` to use an installed Microsoft Edge browser.

## Scope

These checks exercise desktop browser engines at varied viewport sizes. They do not certify every physical device, mobile operating system, assistive technology, or browser version. Physical iOS/Safari and Android testing remains useful before a production launch. This static template does not include a messaging backend, newsletter service, checkout, or verified business content.
