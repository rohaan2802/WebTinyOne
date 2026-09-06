# Responsive verification

Tested on 6 September 2026 using headless Google Chrome, with additional Microsoft Edge accessibility checks.

## Layout matrix

- Widths (CSS pixels): 240, 280, 320, 360, 375, 390, 414, 520, 540, 600, 640, 760, 768, 820, 912, 1000, 1024, 1280, 1440, 1920, 2560, 3840.
- Landscape: 568 × 320, 844 × 390, 1024 × 768.
- Enlarged root text: 200% at a 320px viewport.
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

## Automated accessibility audit

Axe-core 4.10.3 in Microsoft Edge reported zero violations for WCAG 2 A/AA and WCAG 2.1 AA rule tags at 320px, 768px, and 1440px. This automated result is not a complete accessibility certification.

## Run the regression check

Requires Python, the Playwright Python package, and an installed Google Chrome browser:

```sh
python -m pip install playwright
python tests/responsive_check.py
```

The test starts a temporary local server automatically and saves screenshots and JSON results in ignored `tests/artifacts/`. Set the `BROWSER_CHANNEL` environment variable to `msedge` to use an installed Microsoft Edge browser.

## Scope

These checks exercise desktop browser engines at varied viewport sizes. They do not certify every physical device, mobile operating system, assistive technology, or browser version. Physical iOS/Safari and Android testing remains useful before a production launch. This static template does not include a messaging backend, newsletter service, checkout, or verified business content.
