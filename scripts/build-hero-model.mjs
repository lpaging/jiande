import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { Accessor, Document, NodeIO } from "@gltf-transform/core";

// Measurements in metres. The photographs determine the profile and texture,
// but cannot provide a measured interior, foot, or a complete surface scan.
const RIM_RADIUS = 0.1;
const WALL = 0.0004;
const BODY_BOTTOM = 0.014;
const RIM_HEIGHT = 0.095;
const PROFILE_SEGMENTS = 112;
const RADIAL_SEGMENTS = 192;
const TEXTURE_WIDTH = 8192;
const TEXTURE_HEIGHT = 2048;

// Normalized photograph measurements: image centre, rim half-width, and the
// midline of the rim and bowl bottom. The shared tree in views 1/2 and the
// red seal and mountain ridge in views 1/3 fix the relative viewing angles.
const views = [
  { file: "hero-1.webp", cx: 0.5073, half: 0.3314, rim: 0.3273, bottom: 0.7266, yaw: 0 },
  { file: "hero-2.webp", cx: 0.5003, half: 0.3242, rim: 0.3250, bottom: 0.7200, yaw: 1.61 },
  { file: "hero-3.webp", cx: 0.5013, half: 0.3180, rim: 0.3340, bottom: 0.7300, yaw: -2.38 }
];

function bezier(t, a, b, c, d) {
  const s = 1 - t;
  return s ** 3 * a + 3 * s ** 2 * t * b + 3 * s * t ** 2 * c + t ** 3 * d;
}

function curve(t) {
  return {
    // Fit the silhouette measured in all three photographs, including the
    // narrower lower wall where the image projections meet the foot.
    r: bezier(t, 0.037, 0.0605, 0.0805, RIM_RADIUS),
    y: bezier(t, BODY_BOTTOM, 0.0302, 0.0302, RIM_HEIGHT)
  };
}

function radiusAtHeight(t) {
  let low = 0;
  let high = 1;
  const target = BODY_BOTTOM + t * (RIM_HEIGHT - BODY_BOTTOM);
  for (let i = 0; i < 18; i += 1) {
    const middle = (low + high) / 2;
    if (curve(middle).y < target) low = middle;
    else high = middle;
  }
  return curve((low + high) / 2).r / RIM_RADIUS;
}

function normalAt(points, index) {
  const before = points[Math.max(0, index - 1)];
  const after = points[Math.min(points.length - 1, index + 1)];
  const dr = after.r - before.r;
  const dy = after.y - before.y;
  const length = Math.hypot(dr, dy) || 1;
  return { r: dy / length, y: -dr / length };
}

function makeProfiles() {
  const outer = [{ r: 0, y: BODY_BOTTOM }];
  for (let i = 0; i <= PROFILE_SEGMENTS; i += 1) {
    outer.push(curve(i / PROFILE_SEGMENTS));
  }
  const normals = outer.map((_, index) => normalAt(outer, index));
  const inner = outer.map((point, index) => ({
    // On the rotation axis there is no radial direction. Both surfaces meet
    // the axis independently, 0.4 mm apart vertically.
    r: Math.max(0, point.r - WALL * normals[index].r),
    y: point.y - WALL * normals[index].y
  }));
  return { outer, inner, normals };
}

function surface(points, normalPoints, inverted = false) {
  const positions = [];
  const normals = [];
  const uvs = [];
  const indices = [];
  for (let row = 0; row < points.length; row += 1) {
    const point = points[row];
    const normal = normalPoints[row];
    const v = 1 - Math.max(0, Math.min(1, (point.y - BODY_BOTTOM) / (RIM_HEIGHT - BODY_BOTTOM)));
    for (let col = 0; col <= RADIAL_SEGMENTS; col += 1) {
      const theta = (col / RADIAL_SEGMENTS) * Math.PI * 2;
      const sine = Math.sin(theta);
      const cosine = Math.cos(theta);
      const sign = inverted ? -1 : 1;
      positions.push(point.r * sine, point.y, point.r * cosine);
      normals.push(sign * normal.r * sine, sign * normal.y, sign * normal.r * cosine);
      uvs.push(col / RADIAL_SEGMENTS, v);
    }
  }
  const stride = RADIAL_SEGMENTS + 1;
  for (let row = 0; row < points.length - 1; row += 1) {
    for (let col = 0; col < RADIAL_SEGMENTS; col += 1) {
      const a = row * stride + col;
      const b = a + 1;
      const c = a + stride;
      const d = c + 1;
      if (inverted) indices.push(a, c, b, b, c, d);
      else indices.push(a, b, c, b, d, c);
    }
  }
  return {
    positions: new Float32Array(positions),
    normals: new Float32Array(normals),
    uvs: new Float32Array(uvs),
    indices: new Uint16Array(indices)
  };
}

function angleDifference(a, b) {
  return Math.atan2(Math.sin(a - b), Math.cos(a - b));
}

function smoothstep(a, b, value) {
  const x = Math.max(0, Math.min(1, (value - a) / (b - a)));
  return x * x * (3 - 2 * x);
}

function sample(photo, x, y) {
  // Bilinear sampling keeps the mapped brush marks and calligraphy smooth.
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  if (ix < 0 || iy < 0 || ix >= photo.width - 1 || iy >= photo.height - 1) return null;
  const dx = x - ix;
  const dy = y - iy;
  const result = [0, 0, 0];
  for (let channel = 0; channel < 3; channel += 1) {
    const a = photo.data[(iy * photo.width + ix) * 3 + channel];
    const b = photo.data[(iy * photo.width + ix + 1) * 3 + channel];
    const c = photo.data[((iy + 1) * photo.width + ix) * 3 + channel];
    const d = photo.data[((iy + 1) * photo.width + ix + 1) * 3 + channel];
    result[channel] = (a * (1 - dx) + b * dx) * (1 - dy) + (c * (1 - dx) + d * dx) * dy;
  }
  return result;
}

function isStudioBackground(rgb) {
  const brightest = Math.max(...rgb);
  const chroma = brightest - Math.min(...rgb);
  return chroma < 7 || (brightest < 220 && chroma < 25);
}

function inkOnPorcelain(rgb, height) {
  const brightest = Math.max(...rgb);
  // Remove the photographed studio's changing neutral illumination but retain
  // red pigment and dark handwriting from the photographed areas.
  // The calligraphy is high on the bowl. At the lower edge dark neutral
  // pixels are the studio shadow outside the silhouette, not decoration.
  const pigment = smoothstep(5, 24, brightest - Math.min(...rgb));
  const pigmentDarkness = Math.max(0, 244 - brightest) * 0.8 * pigment;
  const inkDarkness = Math.max(0, 210 - brightest) * 1.15 * smoothstep(0.43, 0.55, height);
  const darkness = Math.max(pigmentDarkness, inkDarkness);
  const white = [249, 246, 244];
  return white.map((base, channel) => Math.max(0, Math.min(255,
    base - (brightest - rgb[channel]) - darkness
  )));
}

function sourcePoint(photo, phi, height, radii) {
  const radius = radii[Math.round((1 - height) * (TEXTURE_HEIGHT - 1))];
  return {
    x: photo.width * (photo.cx + photo.half * radius * Math.sin(phi)),
    y: photo.height * (photo.rim + (1 - height) * (photo.bottom - photo.rim))
      + photo.width * photo.half * radius * 0.03 * Math.cos(phi)
  };
}

function measureSilhouette(photo) {
  const stepY = 4;
  const rows = Math.ceil(photo.height / stepY);
  const bounds = new Float32Array(rows * 2);
  for (let row = 0; row < rows; row += 1) {
    const y = Math.min(photo.height - 1, row * stepY);
    let left = photo.width;
    let right = 0;
    for (let x = Math.floor(photo.width * 0.15); x < photo.width * 0.85; x += 3) {
      const offset = (y * photo.width + x) * 3;
      const r = photo.data[offset];
      const g = photo.data[offset + 1];
      const b = photo.data[offset + 2];
      if (Math.max(r, g, b) - Math.min(r, g, b) >= 7) {
        left = Math.min(left, x);
        right = x;
      }
    }
    bounds[row * 2] = left;
    bounds[row * 2 + 1] = right;
  }
  return bounds;
}

async function makeTexture() {
  const photos = await Promise.all(views.map(async (view) => {
    const imagePath = path.join(process.cwd(), "public/images", view.file);
    const { data, info } = await sharp(imagePath)
      .removeAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    return { ...view, data, width: info.width, height: info.height };
  }));
  const radii = Array.from({ length: TEXTURE_HEIGHT }, (_, row) =>
    radiusAtHeight(1 - row / (TEXTURE_HEIGHT - 1))
  );
  for (const photo of photos) photo.silhouette = measureSilhouette(photo);
  const pixels = Buffer.alloc(TEXTURE_WIDTH * TEXTURE_HEIGHT * 3);
  const mappedMask = new Uint8Array(TEXTURE_WIDTH * TEXTURE_HEIGHT);
  for (let row = 0; row < TEXTURE_HEIGHT; row += 1) {
    const height = 1 - row / (TEXTURE_HEIGHT - 1);
    for (let col = 0; col < TEXTURE_WIDTH; col += 1) {
      const theta = (col / TEXTURE_WIDTH) * Math.PI * 2;
      let sum = 0;
      const color = [0, 0, 0];
      for (const photo of photos) {
        const phi = angleDifference(theta, photo.yaw);
        const absPhi = Math.abs(phi);
        // Avoid severely foreshortened edge pixels and the studio background.
        if (absPhi >= 1.46) continue;
        // Blend the registered views over their shared features, tapering out
        // the strongly foreshortened edge of each photograph.
        let weight = 1 - smoothstep(0.72, 1.46, absPhi);
        // The photographs include the foot and its studio shadow below the
        // painted wall. Extend the adjacent paint over that narrow lower strip.
        const sampleHeight = height + 0.10 * (1 - smoothstep(0, 0.22, height));
        const point = sourcePoint(photo, phi, sampleHeight, radii);
        if (sampleHeight < 0.5) {
          const edgeRow = Math.max(0, Math.min(photo.silhouette.length / 2 - 1, Math.floor(point.y / 4)));
          const distance = Math.min(point.x - photo.silhouette[edgeRow * 2],
            photo.silhouette[edgeRow * 2 + 1] - point.x);
          weight *= smoothstep(12, 90, distance);
          if (!weight) continue;
        }
        const rgb = sample(photo, point.x, point.y);
        // Gray pixels below the photographed silhouette belong to the studio.
        if (!rgb || (height < 0.35 && isStudioBackground(rgb))) continue;
        const ink = inkOnPorcelain(rgb, height);
        for (let channel = 0; channel < 3; channel += 1) color[channel] += ink[channel] * weight;
        sum += weight;
      }
      const offset = (row * TEXTURE_WIDTH + col) * 3;
      const white = [249, 246, 244];
      mappedMask[row * TEXTURE_WIDTH + col] = sum > 0 ? 1 : 0;
      for (let channel = 0; channel < 3; channel += 1) {
        const mapped = sum ? color[channel] / sum : white[channel];
        pixels[offset + channel] = Math.round(mapped);
      }
    }
  }
  // Fill narrow silhouette gaps along each latitude from neighboring painted
  // pixels. This continues the landscape's color without fabricating writing.
  for (let row = 0; row < TEXTURE_HEIGHT; row += 1) {
    const rowStart = row * TEXTURE_WIDTH;
    let first = -1;
    for (let col = 0; col < TEXTURE_WIDTH; col += 1) {
      if (mappedMask[rowStart + col]) {
        first = col;
        break;
      }
    }
    if (first < 0) continue;
    let previous = first;
    do {
      let distance = 1;
      while (distance < TEXTURE_WIDTH &&
        !mappedMask[rowStart + (previous + distance) % TEXTURE_WIDTH]) distance += 1;
      const col = (previous + distance) % TEXTURE_WIDTH;
      for (let missing = 1; missing < distance; missing += 1) {
        const fillCol = (previous + missing) % TEXTURE_WIDTH;
        const t = smoothstep(0, 1, missing / distance);
        for (let channel = 0; channel < 3; channel += 1) {
          const before = pixels[(rowStart + previous) * 3 + channel];
          const after = pixels[(rowStart + col) * 3 + channel];
          pixels[(rowStart + fillCol) * 3 + channel] = Math.round(before * (1 - t) + after * t);
        }
      }
      previous = col;
    } while (previous !== first);
  }
  const input = { raw: { width: TEXTURE_WIDTH, height: TEXTURE_HEIGHT, channels: 3 } };
  const jpegOptions = { quality: 96, chromaSubsampling: "4:4:4", mozjpeg: true };
  const [outerHigh, outerCompact] = await Promise.all([
    sharp(pixels, input).jpeg(jpegOptions).toBuffer(),
    sharp(pixels, input).resize(4096, TEXTURE_HEIGHT, { fit: "fill" }).jpeg(jpegOptions).toBuffer()
  ]);

  return { outerHigh, outerCompact };
}

function addPrimitive(document, buffer, mesh, data, material) {
  const accessor = (array, type) => document.createAccessor().setBuffer(buffer).setType(type).setArray(array);
  mesh.addPrimitive(document.createPrimitive()
    .setAttribute("POSITION", accessor(data.positions, Accessor.Type.VEC3))
    .setAttribute("NORMAL", accessor(data.normals, Accessor.Type.VEC3))
    .setAttribute("TEXCOORD_0", accessor(data.uvs, Accessor.Type.VEC2))
    .setIndices(accessor(data.indices, Accessor.Type.SCALAR))
    .setMaterial(material));
}

async function main() {
  const { outer, inner, normals } = makeProfiles();
  const textures = await makeTexture();
  const document = new Document();
  const buffer = document.createBuffer();
  const texture = document.createTexture("photo-derived-decoration")
    .setMimeType("image/jpeg").setImage(textures.outerHigh);
  const painted = document.createMaterial("painted-body")
    .setBaseColorTexture(texture).setMetallicFactor(0).setRoughnessFactor(0.38);
  const porcelain = document.createMaterial("porcelain")
    .setBaseColorFactor([0.98, 0.97, 0.96, 1]).setMetallicFactor(0).setRoughnessFactor(0.32);
  const rimMaterial = document.createMaterial("rim")
    .setBaseColorFactor([0.97, 0.955, 0.94, 1]).setMetallicFactor(0).setRoughnessFactor(0.28);
  const footMaterial = document.createMaterial("foot")
    .setBaseColorFactor([0.92, 0.81, 0.82, 1]).setMetallicFactor(0).setRoughnessFactor(0.4);
  const mesh = document.createMesh("thin-porcelain-bowl");
  addPrimitive(document, buffer, mesh, surface(outer, normals), painted);
  addPrimitive(document, buffer, mesh, surface(inner, normals, true), porcelain);

  const last = outer.length - 1;
  const rim = [outer[last], inner[last]];
  const rimNormals = rim.map(() => ({ r: 0, y: 1 }));
  addPrimitive(document, buffer, mesh, surface(rim, rimNormals), rimMaterial);

  const footOuter = [
    { r: 0.0358, y: 0.0004 }, { r: 0.0365, y: 0.0010 },
    { r: 0.0370, y: 0.0030 }, { r: 0.0375, y: 0.0128 },
    { r: 0.0368, y: BODY_BOTTOM }
  ];
  const footNormals = footOuter.map((_, index) => normalAt(footOuter, index));
  const footInner = footOuter.map((point, index) => ({
    r: point.r - WALL * footNormals[index].r,
    y: point.y - WALL * footNormals[index].y
  }));
  // Outer wall, top edge, inner wall, and bottom edge form a closed thin ring.
  const foot = [...footOuter, ...footInner.reverse(), footOuter[0]];
  addPrimitive(document, buffer, mesh, surface(foot, foot.map((_, i) => normalAt(foot, i))), footMaterial);

  document.createScene("bowl").addChild(document.createNode("thin-porcelain-bowl").setMesh(mesh));
  const outputDir = path.join(process.cwd(), "public/models");
  await fs.mkdir(outputDir, { recursive: true });
  const io = new NodeIO();
  await io.write(path.join(outputDir, "hero-bowl.glb"), document);
  texture.setImage(textures.outerCompact);
  await io.write(path.join(outputDir, "hero-bowl-compact.glb"), document);
  console.log(`Generated high-resolution and compact models (diameter 200 mm; bowl and foot wall ${WALL * 1000} mm).`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
