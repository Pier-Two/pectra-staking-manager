import { generateOpenGraphImage } from "../../../components/opengraph-image";

export const runtime = "edge";

export async function GET() {
  try {
    const image = await generateOpenGraphImage();
    return new Response(image.body, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (e) {
    console.error("Error generating OpenGraph image:", e);
    return new Response("Failed to generate image", { status: 500 });
  }
}
