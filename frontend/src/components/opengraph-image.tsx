import { ImageResponse } from "next/og";
import PectraStakingManager from "./logos/PectraStakingManager";

// Image metadata
// These must be re-exported from the individual opengraph-image.ts files
export const size = {
  width: 1200,
  height: 630,
} as const;
export const contentType = "image/png";

export const generateOpenGraphImage = async () => {
  const fontData = await fetch(
    new URL("src/fonts/Saans-TRIAL-VF.otf", import.meta.url),
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#EEF2FF",
          fontFamily: '"Saans"',
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <PectraStakingManager />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              textAlign: "right",
            }}
          >
            <h1
              style={{
                fontSize: "120px",
                lineHeight: "60px",
                fontWeight: 900,
              }}
            >
              Pectra Staking
            </h1>
            <h1
              style={{
                fontSize: "120px",
                lineHeight: "60px",
                fontWeight: 900,
              }}
            >
              Manager
            </h1>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Saans",
          data: fontData,
          style: "normal",
          weight: 400,
        },
      ],
    },
  );
};
