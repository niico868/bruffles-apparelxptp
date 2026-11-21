// Renders scripts/travel-ink.svg (with its ink filter) to a transparent PNG once,
// so the browser shows a still image instead of re-running the filter while scrolling.
// Run: node scripts/render-ink.cjs   (needs Playwright + Chromium)
const { chromium } = require("playwright"); const fs = require("fs"); const path = require("path");
(async () => {
  const svg = fs.readFileSync(path.join(__dirname, "travel-ink.svg"), "utf8");
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1400, height: 2800 } });
  await p.setContent(`<html><head><style>@import url("https://fonts.googleapis.com/css2?family=DM+Mono&display=block");html,body{margin:0;background:transparent}</style></head><body>${svg}</body></html>`);
  await p.waitForTimeout(800);
  await p.locator("svg").screenshot({ path: path.join(__dirname, "../public/art/travel-ink.png"), omitBackground: true });
  await b.close();
})();
