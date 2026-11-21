// Renders scripts/passport-cover.svg to public/art/passport-cover.webp (via PNG + Pillow). Run once.
const { chromium } = require("playwright"); const fs = require("fs"); const path = require("path"); const { execSync } = require("child_process");
(async () => {
  const svg = fs.readFileSync(path.join(__dirname, "passport-cover.svg"), "utf8");
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1200, height: 1600 } });
  await p.setContent(`<html><body style="margin:0">${svg}</body></html>`); await p.waitForTimeout(500);
  const png = path.join(__dirname, "../public/art/passport-cover.png");
  await p.locator("svg").screenshot({ path: png }); await b.close();
  execSync(`python3 -c "from PIL import Image; Image.open('${png}').convert('RGB').save('${png.replace(".png", ".webp")}','WEBP',quality=82,method=6)"`);
  fs.unlinkSync(png);
})();
