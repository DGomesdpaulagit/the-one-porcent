import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#08080a",
          borderRadius: 14,
          border: "2px solid #3a3628",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 26,
            fontWeight: 800,
            letterSpacing: -1,
            background:
              "linear-gradient(120deg, #f5d67a, #d4af37 60%, #8a6f24)",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          1%
        </div>
      </div>
    ),
    { ...size },
  );
}
