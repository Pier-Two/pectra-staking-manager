import * as fs from "fs";
import { encode, decode } from "blurhash";
import sharp from "sharp";

interface BlurHashOptions {
  componentX?: number;
  componentY?: number;
  width?: number;
  height?: number;
}

async function generateBlurHashDataURL(
  imagePath: string,
  options: BlurHashOptions = {},
): Promise<string> {
  const { componentX = 4, componentY = 4, width = 32, height = 32 } = options;

  // Check if file exists
  if (!fs.existsSync(imagePath)) {
    throw new Error(`Image file not found: ${imagePath}`);
  }

  try {
    // Step 1: Generate BlurHash from image
    const image = sharp(imagePath);
    const { data, info } = await image
      .raw()
      .ensureAlpha()
      .resize(width, height, { fit: "inside" })
      .toBuffer({ resolveWithObject: true });

    const blurHash: string = encode(
      new Uint8ClampedArray(data),
      info.width,
      info.height,
      componentX,
      componentY,
    );

    console.log("Generated BlurHash:", blurHash);

    // Step 2: Convert BlurHash to data URL using sharp
    const pixels = decode(blurHash, width, height);
    const buffer = Buffer.from(pixels);

    const dataUrl = await sharp(buffer, {
      raw: {
        width,
        height,
        channels: 4,
      },
    })
      .jpeg()
      .toBuffer()
      .then((buffer) => `data:image/jpeg;base64,${buffer.toString("base64")}`);

    return dataUrl;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to process image: ${error.message}`);
    }
    throw new Error("Failed to process image: Unknown error");
  }
}

// Example usage
async function main() {
  try {
    const imagePath =
      process.argv[2] ?? "./public/cards/backgrounds/WorkflowOption.png";
    const dataUrl = await generateBlurHashDataURL(imagePath);

    console.log("\n📷 Generated Data URL:");
    console.log(dataUrl);

    console.log("\n📝 CSS:");
    console.log(`background-image: url("${dataUrl}"), url("${imagePath}");`);
  } catch (error) {
    console.error(
      "❌ Error:",
      error instanceof Error ? error.message : "Unknown error",
    );
    process.exit(1);
  }
}

void main();

export { generateBlurHashDataURL };
