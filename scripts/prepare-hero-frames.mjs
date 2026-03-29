import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const sourceDir = path.join(process.cwd(), "public/images/hero");
const sourcePrefix = "ezgif-frame-";
const sourceExtension = ".png";
const targetCount = 32;
const targetWidth = 1600;
const targetQuality = 78;

function toFrameName(index, extension) {
  return `${sourcePrefix}${String(index).padStart(3, "0")}${extension}`;
}

function pickFrameIndices(sourceCount, nextCount) {
  return Array.from({ length: nextCount }, (_, index) => {
    const ratio = nextCount === 1 ? 0 : index / (nextCount - 1);
    return Math.round(ratio * (sourceCount - 1)) + 1;
  });
}

const entries = await fs.readdir(sourceDir);
const sourceFrames = entries
  .filter((entry) => entry.startsWith(sourcePrefix) && entry.endsWith(sourceExtension))
  .sort();

if (sourceFrames.length === 0) {
  throw new Error(`No source frames found in ${sourceDir}`);
}

const pickedIndices = pickFrameIndices(sourceFrames.length, targetCount);

for (let outputIndex = 0; outputIndex < pickedIndices.length; outputIndex += 1) {
  const sourceIndex = pickedIndices[outputIndex];
  const sourcePath = path.join(sourceDir, toFrameName(sourceIndex, sourceExtension));
  const outputPath = path.join(sourceDir, toFrameName(outputIndex + 1, ".webp"));

  await sharp(sourcePath)
    .resize({ width: targetWidth, withoutEnlargement: true })
    .webp({ quality: targetQuality })
    .toFile(outputPath);
}

console.log(`Generated ${targetCount} WebP hero frames in ${sourceDir}`);
