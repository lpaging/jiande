import path from "node:path";
import { createRequire } from "node:module";
import sharp from "sharp";

// Run against the local site after rebuilding the GLBs. Playwright and a
// Chromium browser are only needed when regenerating these static previews.
const require = createRequire(import.meta.url);
let chromium;
try {
  ({ chromium } = require(process.env.PORCELAIN_PLAYWRIGHT || "playwright"));
} catch {
  throw new Error("Install Playwright or set PORCELAIN_PLAYWRIGHT to its package path to capture the hero posters.");
}

const siteUrl = process.argv[2] || "http://127.0.0.1:3000";
const browser = await chromium.launch({
  headless: true,
  ...(process.env.PORCELAIN_CHROME ? { executablePath: process.env.PORCELAIN_CHROME } : {}),
  args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"]
});

const views = [
  {
    name: "hero-bowl-poster.webp",
    context: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 },
    crop: { width: 1514, height: 759, offsetY: 21.5 }
  },
  {
    name: "hero-bowl-poster-tablet.webp",
    context: { viewport: { width: 768, height: 1024 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
    crop: { width: 1167, height: 606, offsetY: 4.5 }
  },
  {
    name: "hero-bowl-poster-mobile.webp",
    context: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
    crop: { width: 588, height: 316, offsetY: -3 }
  }
];

try {
  for (const view of views) {
    const context = await browser.newContext(view.context);
    const page = await context.newPage();
    await page.goto(siteUrl, { waitUntil: "domcontentloaded" });
    await page.waitForFunction(() => document.querySelector(".hero-bowl-control")?.classList.contains("opacity-100"),
      null, { timeout: 45000 });
    await page.waitForTimeout(1000);
    await page.evaluate(() => {
      document.querySelectorAll(".page-shell").forEach((element) => { element.style.visibility = "hidden"; });
    });
    await page.addStyleTag({ content: "html,body,main,section,div{background:transparent!important;background-image:none!important;box-shadow:none!important}" });
    const frame = page.locator(".hero-bowl-control").locator("..");
    const screenshot = await frame.screenshot({ omitBackground: true });
    const { data, info } = await sharp(screenshot).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const left = Math.round((info.width - view.crop.width) / 2);
    const top = Math.round((info.height - view.crop.height) / 2 + view.crop.offsetY);
    let visiblePixels = 0;
    for (let y = 0; y < info.height; y += 1) {
      for (let x = 0; x < info.width; x += 1) {
        if (data[(y * info.width + x) * 4 + 3] <= 8) continue;
        visiblePixels += 1;
        if (x < left || x >= left + view.crop.width || y < top || y >= top + view.crop.height) {
          throw new Error(`${view.name}: the model no longer fits its poster frame; update the poster dimensions and CSS.`);
        }
      }
    }
    if (visiblePixels < 1000) throw new Error(`${view.name}: no rendered model was captured.`);
    await sharp(screenshot).extract({ left, top, width: view.crop.width, height: view.crop.height })
      .webp({ lossless: true, effort: 5 }).toFile(path.join("public/images", view.name));
    console.log(`Captured public/images/${view.name}`);
    await context.close();
  }
} finally {
  await browser.close();
}
