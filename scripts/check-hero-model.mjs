import { NodeIO } from "@gltf-transform/core";
import sharp from "sharp";

async function checkModel(model, expectedTextureWidth) {
  const document = await new NodeIO().read(model);
  const mesh = document.getRoot().listMeshes().find((item) => item.getName() === "thin-porcelain-bowl");
  if (!mesh) throw new Error("Bowl mesh is missing");
  const primitives = mesh.listPrimitives();
  if (primitives.length !== 4) throw new Error("Expected the outer wall, inner wall, rim and foot");

  const outer = primitives[0].getAttribute("POSITION")?.getArray();
  const inner = primitives[1].getAttribute("POSITION")?.getArray();
  const rim = primitives[2].getAttribute("POSITION")?.getArray();
  const rimIndices = primitives[2].getIndices()?.getArray();
  const foot = primitives[3].getAttribute("POSITION")?.getArray();
  if (!outer || !inner || !rim || !rimIndices || !foot || outer.length !== inner.length) {
    throw new Error("Bowl wall, rim or foot geometry is missing");
  }

  const radius = Math.max(...Array.from({ length: outer.length / 3 }, (_, index) =>
    Math.hypot(outer[index * 3], outer[index * 3 + 2])
  ));
  if (Math.abs(radius * 2 - 0.2) > 0.00001) throw new Error(`Unexpected diameter: ${radius * 2} m`);

  for (let index = 0; index < outer.length; index += 3) {
    const thickness = Math.hypot(
      outer[index] - inner[index], outer[index + 1] - inner[index + 1], outer[index + 2] - inner[index + 2]
    );
    if (Math.abs(thickness - 0.0004) > 0.000001) throw new Error(`Unexpected wall thickness: ${thickness} m`);
  }

  const ringLength = rim.length / 2;
  const outerRimStart = outer.length - ringLength;
  const innerRimStart = inner.length - ringLength;
  const verticesPerRing = ringLength / 3;
  if (rimIndices.length !== (verticesPerRing - 1) * 6) throw new Error("Rim faces are incomplete");
  for (let index = 0; index < ringLength; index += 1) {
    if (Math.abs(rim[index] - outer[outerRimStart + index]) > 1e-7 ||
        Math.abs(rim[index + ringLength] - inner[innerRimStart + index]) > 1e-7) {
      throw new Error("Rim does not connect the inner and outer walls");
    }
  }
  for (const start of [0, ringLength]) {
    for (let coordinate = 0; coordinate < 3; coordinate += 1) {
      if (Math.abs(rim[start + coordinate] - rim[start + ringLength - 3 + coordinate]) > 1e-7) {
        throw new Error("Rim seam is open");
      }
    }
  }

  const footRings = foot.length / ringLength;
  const footOuterRings = (footRings - 1) / 2;
  if (!Number.isInteger(footOuterRings) || footOuterRings < 2) throw new Error("Unexpected foot profile");
  let footBottom = Infinity;
  let footTop = -Infinity;
  for (let row = 0; row < footOuterRings; row += 1) {
    const innerRow = footOuterRings * 2 - 1 - row;
    for (let index = 0; index < ringLength; index += 3) {
      const a = row * ringLength + index;
      const b = innerRow * ringLength + index;
      const thickness = Math.hypot(foot[a] - foot[b], foot[a + 1] - foot[b + 1], foot[a + 2] - foot[b + 2]);
      if (Math.abs(thickness - 0.0004) > 0.000001) throw new Error(`Unexpected foot thickness: ${thickness} m`);
      footBottom = Math.min(footBottom, foot[a + 1]);
      footTop = Math.max(footTop, foot[a + 1]);
    }
  }
  if (Math.abs(footTop - footBottom - 0.0136) > 0.000001) throw new Error("Unexpected foot height");
  const textures = document.getRoot().listTextures();
  const innerMaterial = primitives[1].getMaterial();
  if (textures.length !== 1 || primitives[0].getMaterial()?.getBaseColorTexture() !== textures[0] ||
      innerMaterial?.getBaseColorTexture() || innerMaterial?.getBaseColorFactor().slice(0, 3).some((value) => value < 0.95)) {
    throw new Error("Expected a photo-derived exterior and plain white interior");
  }
  const [width, height] = textures[0].getSize();
  if (width !== expectedTextureWidth || height !== 2048) throw new Error(`Unexpected texture size: ${width}x${height}`);
  const { data } = await sharp(textures[0].getImage()).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  let seamDifference = 0;
  for (let row = 0; row < height; row += 1) {
    for (let channel = 0; channel < 3; channel += 1) {
      seamDifference += Math.abs(data[row * width * 3 + channel] - data[(row * width + width - 1) * 3 + channel]);
    }
  }
  if (seamDifference / (height * 3) > 3) throw new Error("The exterior texture has a visible wrap seam");
  console.log(`${model}: 200 mm diameter, 0.4 mm bowl and foot walls, 13.6 mm foot height, connected rim, ${width}x${height} photo texture and plain white interior.`);
}

await checkModel("public/models/hero-bowl.glb", 8192);
await checkModel("public/models/hero-bowl-compact.glb", 4096);
