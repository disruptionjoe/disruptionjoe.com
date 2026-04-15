import { chromium } from 'playwright';
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const templatePath = resolve(import.meta.dirname, 'banner-template.html');
const template = readFileSync(templatePath, 'utf-8');

const sizes = [
  {
    name: 'twitter-header',
    width: 1500,
    height: 500,
    vars: {
      BANNER_WIDTH: '1500px',
      BANNER_HEIGHT: '500px',
      PADDING_H: '80px',
      CONTENT_GAP: '60px',
      NAME_SIZE: '3.6rem',
      TAG_SIZE: '1.05rem',
      TAG_MARGIN: '18px',
      BAR_MARGIN: '14px',
      RIGHT_GAP: '14px',
      BADGE_PAD: '10px 16px',
      COUNT_SIZE: '1.4rem',
      LABEL_SIZE: '0.6rem',
      CHIP_SIZE: '0.62rem',
      KICKER_TOP: '28px',
      KICKER_SIZE: '0.55rem',
    }
  },
  {
    name: 'linkedin-banner',
    width: 1584,
    height: 396,
    vars: {
      BANNER_WIDTH: '1584px',
      BANNER_HEIGHT: '396px',
      PADDING_H: '80px',
      CONTENT_GAP: '60px',
      NAME_SIZE: '3.2rem',
      TAG_SIZE: '0.95rem',
      TAG_MARGIN: '14px',
      BAR_MARGIN: '12px',
      RIGHT_GAP: '12px',
      BADGE_PAD: '8px 14px',
      COUNT_SIZE: '1.25rem',
      LABEL_SIZE: '0.55rem',
      CHIP_SIZE: '0.58rem',
      KICKER_TOP: '24px',
      KICKER_SIZE: '0.5rem',
    }
  }
];

const browser = await chromium.launch();

for (const size of sizes) {
  let html = template;
  for (const [key, value] of Object.entries(size.vars)) {
    html = html.replaceAll(key, value);
  }

  const page = await browser.newPage();
  await page.setViewportSize({ width: size.width, height: size.height });
  await page.setContent(html, { waitUntil: 'networkidle' });

  // Wait for fonts to load
  await page.waitForTimeout(1500);

  const outPath = resolve(import.meta.dirname, `${size.name}.png`);
  await page.screenshot({ path: outPath, type: 'png' });
  console.log(`Saved ${outPath}`);
  await page.close();
}

await browser.close();
