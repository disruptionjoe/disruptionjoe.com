// Generate OG images by screenshotting the HTML templates at 1200x630.
// Usage: node og-templates/generate.mjs
import { chromium } from 'playwright';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const siteRoot = path.resolve(__dirname, '..');

const targets = [
  { html: 'og-home.html',    out: path.join(siteRoot, 'og-image.jpg') },
  { html: 'og-webinar.html', out: path.join(siteRoot, 'og-webinar.jpg') },
];

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1200, height: 630 },
  deviceScaleFactor: 2,
});

for (const { html, out } of targets) {
  const page = await context.newPage();
  const url = pathToFileURL(path.join(__dirname, html)).href;
  await page.goto(url, { waitUntil: 'networkidle' });
  // Allow web fonts to settle
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(400);
  await page.screenshot({ path: out, type: 'jpeg', quality: 92, fullPage: false });
  console.log('wrote', out);
  await page.close();
}

await browser.close();
