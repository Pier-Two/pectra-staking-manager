import { generateOpenGraphImage } from "pec/components/opengraph-image";

export default async function OpenGraphImage() {
  return generateOpenGraphImage();
}

export { size, contentType } from "pec/components/opengraph-image";
