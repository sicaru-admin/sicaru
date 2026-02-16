import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt =
  "Distribuidora Sicarú — Productos de Belleza Profesional";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #2D1B4E 0%, #6B3FA0 50%, #E84393 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: "#FFFFFF",
            marginBottom: 16,
            letterSpacing: "-0.02em",
          }}
        >
          Distribuidora Sicarú
        </div>

        <div
          style={{
            fontSize: 28,
            color: "#DEC9EE",
            maxWidth: 800,
            textAlign: "center",
            lineHeight: 1.4,
          }}
        >
          Productos de Belleza Profesional — Envío a Todo México
        </div>

        <div
          style={{
            display: "flex",
            gap: 24,
            marginTop: 40,
            fontSize: 18,
            color: "#D4A853",
            fontWeight: 600,
          }}
        >
          <span>Küül</span>
          <span>•</span>
          <span>Voglia</span>
          <span>•</span>
          <span>Nekane</span>
          <span>•</span>
          <span>Hidra Color</span>
          <span>•</span>
          <span>Xiomara</span>
          <span>•</span>
          <span>Vitale</span>
          <span>•</span>
          <span>Montis</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
