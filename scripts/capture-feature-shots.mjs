import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';
import { createReadStream, statSync } from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const outDir = path.join(root, 'docs', 'screenshots');
fs.mkdirSync(outDir, { recursive: true });

const mime = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ttf': 'font/ttf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ico': 'image/x-icon',
};

function startServer(port = 8766) {
  const server = http.createServer((req, res) => {
    let urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
    if (urlPath === '/') urlPath = '/index.html';
    const filePath = path.join(root, urlPath.replace(/^\//, ''));
    if (!filePath.startsWith(root) || !fs.existsSync(filePath) || statSync(filePath).isDirectory()) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': mime[ext] || 'application/octet-stream' });
    createReadStream(filePath).pipe(res);
  });
  return new Promise((resolve) => server.listen(port, '127.0.0.1', () => resolve(server)));
}

async function preparePage(page) {
  await page.addStyleTag({
    content: `
      html { scroll-behavior: auto !important; }
      .reading-progress,
      .back-to-top {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        height: 0 !important;
        max-height: 0 !important;
        overflow: hidden !important;
        pointer-events: none !important;
      }
      *, *::before, *::after {
        animation: none !important;
        transition: none !important;
        scroll-behavior: auto !important;
      }
    `,
  });
  await page.evaluate(() => {
    document.querySelectorAll('.reading-progress, .back-to-top').forEach((el) => el.remove());
    // Prevent presentation.js from writing transform on a detached progress node / errors
    window.addEventListener('scroll', (event) => event.stopImmediatePropagation(), true);
    window.addEventListener('resize', (event) => event.stopImmediatePropagation(), true);
  });
}

async function setTheme(page, theme) {
  await page.evaluate((value) => {
    document.documentElement.dataset.theme = value;
    try {
      localStorage.setItem('WebTinyOne-theme', value);
    } catch {}
    const btn = document.querySelector('.theme-toggle');
    if (btn) {
      const dark = value === 'dark';
      btn.hidden = false;
      const span = btn.querySelector('span');
      const icon = btn.querySelector('i');
      if (span) span.textContent = dark ? 'Light theme' : 'Dark theme';
      if (icon) icon.className = dark ? 'fas fa-sun' : 'fas fa-moon';
    }
  }, theme);
  await page.waitForTimeout(120);
}

async function stripFixedChrome(page) {
  await page.evaluate(() => {
    document.querySelectorAll('.reading-progress, .back-to-top, .shot-progress').forEach((el) => el.remove());
    document.querySelectorAll('body *').forEach((el) => {
      const style = window.getComputedStyle(el);
      if (style.position !== 'fixed' && style.position !== 'sticky') return;
      const rect = el.getBoundingClientRect();
      // Kill thin top bars / sticky overlays that leak into crops
      if (rect.top <= 8 && rect.height <= 12) el.remove();
    });
  });
}

async function elShot(page, selector, file, pad = 20) {
  const el = page.locator(selector).first();
  await el.waitFor({ state: 'visible', timeout: 15000 });
  await stripFixedChrome(page);
  await el.scrollIntoViewIfNeeded();
  await page.waitForTimeout(180);
  await stripFixedChrome(page);

  const sel = selector.split(',')[0].trim();
  await page.evaluate(
    ({ selector: target, padPx }) => {
      const node = document.querySelector(target);
      if (!node) return;
      node.dataset._shotPad = '1';
      node.style.paddingTop = `${padPx}px`;
      node.style.paddingBottom = `${padPx}px`;
      node.style.paddingLeft = `${Math.max(12, padPx / 2)}px`;
      node.style.paddingRight = `${Math.max(12, padPx / 2)}px`;
      node.style.boxSizing = 'border-box';
      node.style.overflow = 'visible';
    },
    { selector: sel, padPx: pad }
  );

  await page.waitForTimeout(80);
  const box = await el.boundingBox();
  if (!box) throw new Error(`No box for ${file}`);

  const viewport = page.viewportSize();
  await stripFixedChrome(page);

  // Expand viewport when needed so tall sections are never half-clipped
  if (box.height > viewport.height - 16) {
    await page.setViewportSize({
      width: viewport.width,
      height: Math.min(2600, Math.ceil(box.height) + 100),
    });
    await el.scrollIntoViewIfNeeded();
    await page.waitForTimeout(120);
    await stripFixedChrome(page);
  }

  const finalBox = await el.boundingBox();
  const clip = {
    x: Math.max(0, Math.floor(finalBox.x)),
    y: Math.max(0, Math.floor(finalBox.y)),
    width: Math.min(Math.ceil(finalBox.width), page.viewportSize().width),
    height: Math.ceil(finalBox.height),
  };

  await page.screenshot({
    path: path.join(outDir, file),
    clip,
    type: 'png',
    animations: 'disabled',
  });

  if (page.viewportSize().height !== viewport.height) {
    await page.setViewportSize(viewport);
  }

  await page.evaluate((target) => {
    const node = document.querySelector(target);
    if (!node || node.dataset._shotPad !== '1') return;
    node.style.paddingTop = '';
    node.style.paddingBottom = '';
    node.style.paddingLeft = '';
    node.style.paddingRight = '';
    node.style.overflow = '';
    delete node.dataset._shotPad;
  }, sel);

  console.log('saved', file, `${clip.width}x${Math.round(box.height)}`);
}

async function showOnlyWorkCards(page, count) {
  await page.evaluate((keep) => {
    const cards = [...document.querySelectorAll('.work-card')];
    cards.forEach((card, index) => {
      card.dataset._shotHidden = card.hidden ? '1' : '0';
      const hide = index >= keep;
      card.hidden = hide;
      card.style.display = hide ? 'none' : '';
    });
    const status = document.querySelector('.filter-status');
    if (status) {
      status.dataset._shotText = status.textContent || '';
      status.textContent = `Showing ${keep} projects`;
    }
  }, count);
}

async function restoreWorkCards(page) {
  await page.evaluate(() => {
    document.querySelectorAll('.work-card').forEach((card) => {
      card.style.display = '';
      card.hidden = card.dataset._shotHidden === '1';
      delete card.dataset._shotHidden;
    });
    const status = document.querySelector('.filter-status');
    if (status && status.dataset._shotText != null) {
      status.textContent = status.dataset._shotText;
      delete status.dataset._shotText;
    }
  });
}

async function main() {
  for (const f of fs.readdirSync(outDir)) {
    if (/\.(png|webp|jpg|jpeg)$/i.test(f)) fs.unlinkSync(path.join(outDir, f));
  }

  const server = await startServer(8766);
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({
    viewport: { width: 1360, height: 1200 },
    deviceScaleFactor: 1,
  });

  await page.goto('http://127.0.0.1:8766/', { waitUntil: 'networkidle' });
  await setTheme(page, 'dark');
  await page.reload({ waitUntil: 'networkidle' });
  await preparePage(page);
  await setTheme(page, 'dark');
  await page.waitForTimeout(350);

  await elShot(page, '.hero', '01-hero-landing.png', 16);
  await elShot(page, '.site-header', '02-navigation-theme.png', 14);
  await elShot(page, '#features', '03-features-section.png', 24);
  await elShot(page, '#pricing', '04-pricing-plans.png', 24);

  await page.locator('#work').scrollIntoViewIfNeeded();
  await page.locator('.work-filters button[data-filter="All"]').click();
  await page.waitForTimeout(180);
  await showOnlyWorkCards(page, 4);
  await elShot(page, '#work', '05-work-gallery.png', 24);
  await restoreWorkCards(page);

  await page.locator('.work-filters button[data-filter="Portraits"]').click();
  await page.waitForTimeout(250);
  await showOnlyWorkCards(page, 4);
  await elShot(page, '#work', '06-gallery-filter-active.png', 24);
  await restoreWorkCards(page);

  await page.locator('.work-filters button[data-filter="All"]').click();
  await page.waitForTimeout(180);
  await page.locator('.work-preview').first().click();
  await page.waitForTimeout(350);
  const open = await page.evaluate(() => {
    const d = document.querySelector('.image-viewer');
    return Boolean(d && d.open);
  });
  if (open) {
    await page.locator('.image-viewer').screenshot({
      path: path.join(outDir, '07-image-viewer.png'),
      type: 'png',
      animations: 'disabled',
    });
    console.log('saved', '07-image-viewer.png');
  } else {
    await elShot(page, '.work-card', '07-image-viewer.png', 12);
  }
  await page.keyboard.press('Escape');
  await page.waitForTimeout(180);

  await elShot(page, '#team', '08-team-section.png', 28);
  await elShot(page, '#story', '09-story-stats.png', 28);
  await elShot(page, '#contact', '10-contact-form.png', 28);

  await page.evaluate(() => {
    const faq = document.querySelector('#project-notes .project-faq');
    if (faq) {
      faq.dataset._shotDisplay = faq.style.display || '';
      faq.style.display = 'none';
    }
  });
  await elShot(page, '#project-notes', '11-project-notes.png', 28);
  await page.evaluate(() => {
    const faq = document.querySelector('#project-notes .project-faq');
    if (faq) {
      faq.style.display = faq.dataset._shotDisplay || '';
      delete faq.dataset._shotDisplay;
    }
  });

  await page.locator('#project-notes details').first().evaluate((el) => {
    el.open = true;
  });
  await page.waitForTimeout(180);
  await elShot(page, '#project-notes .project-faq', '12-faq-details.png', 24);

  // Shot 13: restore a progress bar intentionally (clean header strip)
  await page.evaluate(() => {
    const bar = document.createElement('div');
    bar.className = 'reading-progress shot-progress';
    bar.setAttribute('aria-hidden', 'true');
    bar.innerHTML = '<span></span>';
    bar.style.cssText =
      'display:block!important;visibility:visible!important;opacity:1!important;height:4px!important;position:fixed;top:0;left:0;width:100%;z-index:99;pointer-events:none;';
    const span = bar.querySelector('span');
    span.style.cssText =
      'display:block;width:100%;height:100%;background:#f4d94e;transform:scaleX(0.62);transform-origin:left;';
    document.body.prepend(bar);
  });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(150);
  await page.screenshot({
    path: path.join(outDir, '13-reading-progress.png'),
    clip: { x: 0, y: 0, width: 1360, height: 140 },
    type: 'png',
    animations: 'disabled',
  });
  await page.evaluate(() => document.querySelector('.shot-progress')?.remove());
  console.log('saved', '13-reading-progress.png');

  await setTheme(page, 'light');
  await page.reload({ waitUntil: 'networkidle' });
  await preparePage(page);
  await setTheme(page, 'light');
  await page.waitForTimeout(350);
  await elShot(page, '.hero', '14-light-theme-hero.png', 16);
  await elShot(page, '.site-footer', '15-footer-newsletter.png', 24);

  await browser.close();
  server.close();
  console.log('done');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
