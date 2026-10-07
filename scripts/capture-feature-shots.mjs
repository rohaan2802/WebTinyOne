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

async function clipShot(page, file, box, maxH = 680) {
  if (!box) throw new Error(`Missing box for ${file}`);
  const clip = {
    x: Math.max(0, Math.floor(box.x)),
    y: Math.max(0, Math.floor(box.y)),
    width: Math.min(Math.ceil(box.width), 1280),
    height: Math.min(Math.ceil(box.height), maxH),
  };
  await page.screenshot({ path: path.join(outDir, file), clip, type: 'png' });
  console.log('saved', file, `${clip.width}x${clip.height}`);
}

async function elShot(page, selector, file, maxH = 680, pad = 8) {
  const el = page.locator(selector).first();
  await el.waitFor({ state: 'visible', timeout: 15000 });
  await el.scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);
  const box = await el.boundingBox();
  await clipShot(
    page,
    file,
    {
      x: box.x - pad,
      y: box.y - pad,
      width: box.width + pad * 2,
      height: box.height + pad * 2,
    },
    maxH
  );
}

async function main() {
  for (const f of fs.readdirSync(outDir)) {
    if (/\.(png|webp|jpg|jpeg)$/i.test(f)) fs.unlinkSync(path.join(outDir, f));
  }

  const server = await startServer(8766);
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({
    viewport: { width: 1280, height: 900 },
    deviceScaleFactor: 1,
  });

  await page.goto('http://127.0.0.1:8766/', { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    localStorage.setItem('WebTinyOne-theme', 'dark');
    document.documentElement.dataset.theme = 'dark';
  });
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(600);

  await elShot(page, '.hero', '01-hero-landing.png', 700, 0);
  await elShot(page, '.site-header', '02-navigation-theme.png', 160, 12);
  await elShot(page, '#features', '03-features-section.png', 680, 8);
  await elShot(page, '#pricing .wrap, #pricing', '04-pricing-plans.png', 680, 8);

  await page.locator('#work').scrollIntoViewIfNeeded();
  await page.waitForTimeout(250);
  const work = await page.locator('#work').boundingBox();
  await clipShot(page, '05-work-gallery.png', work, 680);

  await page.locator('.work-filters button[data-filter="Portraits"]').click();
  await page.waitForTimeout(450);
  const filtered = await page.locator('#work').boundingBox();
  await clipShot(page, '06-gallery-filter-active.png', filtered, 560);

  await page.locator('.work-filters button[data-filter="All"]').click();
  await page.waitForTimeout(300);
  await page.locator('.work-preview').first().click();
  await page.waitForTimeout(500);
  const viewerOpen = await page.evaluate(() => {
    const d = document.querySelector('.image-viewer');
    return d && d.open;
  });
  if (viewerOpen) {
    await page.screenshot({
      path: path.join(outDir, '07-image-viewer.png'),
      type: 'png',
    });
    console.log('saved 07-image-viewer.png (full)');
  } else {
    await elShot(page, '.work-card', '07-image-viewer.png', 420, 8);
  }
  await page.keyboard.press('Escape');
  await page.waitForTimeout(250);

  await elShot(page, '#team', '08-team-section.png', 680, 8);
  await elShot(page, '#story', '09-story-stats.png', 620, 8);
  await elShot(page, '#contact .contact-layout', '10-contact-form.png', 640, 10);

  const notes = await page.locator('#project-notes').boundingBox();
  await page.locator('#project-notes').scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);
  await clipShot(page, '11-project-notes.png', await page.locator('#project-notes').boundingBox(), 560);

  await page.locator('#project-notes details').first().evaluate((el) => {
    el.open = true;
  });
  await page.waitForTimeout(250);
  await elShot(page, '#project-notes .project-faq', '12-faq-details.png', 520, 10);

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.6));
  await page.waitForTimeout(400);
  await page.locator('.back-to-top').evaluate((el) => {
    el.hidden = false;
  });
  await page.screenshot({
    path: path.join(outDir, '13-reading-progress.png'),
    clip: { x: 0, y: 0, width: 1280, height: 80 },
    type: 'png',
  });
  // also include back-to-top in a corner crop
  const btt = await page.locator('.back-to-top').boundingBox();
  if (btt) {
    await page.screenshot({
      path: path.join(outDir, '13-reading-progress.png'),
      clip: {
        x: 0,
        y: Math.max(0, btt.y - 40),
        width: 1280,
        height: Math.min(220, 900 - Math.max(0, btt.y - 40)),
      },
      type: 'png',
    });
  }
  console.log('saved 13-reading-progress.png');

  await page.evaluate(() => {
    localStorage.setItem('WebTinyOne-theme', 'light');
    document.documentElement.dataset.theme = 'light';
  });
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  await elShot(page, '.hero', '14-light-theme-hero.png', 700, 0);

  await page.locator('.site-footer').scrollIntoViewIfNeeded();
  await page.waitForTimeout(250);
  await elShot(page, '.site-footer', '15-footer-newsletter.png', 560, 8);

  await browser.close();
  server.close();
  console.log('done');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
