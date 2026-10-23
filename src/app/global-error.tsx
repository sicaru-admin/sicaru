"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="es-MX">
      <body style={{ margin: 0, background: "#faf8f5", color: "#2e2b2b", fontFamily: "sans-serif" }}>
        <main style={{ maxWidth: 480, margin: "12vh auto", padding: 24, textAlign: "center" }}>
          <p style={{ color: "#7f6d8a", letterSpacing: "0.12em" }}>SICARÚ</p>
          <h1 style={{ fontFamily: "Georgia, serif", fontWeight: 400 }}>No pudimos cargar esta página.</h1>
          <p>Puedes intentarlo de nuevo o escribirnos. Estamos cerca.</p>
          <button onClick={reset} style={{ minHeight: 48, margin: 12, padding: "12px 24px", border: 0, borderRadius: 6, background: "#7f6d8a", color: "white", cursor: "pointer" }}>Intentar de nuevo</button>
          <p><a href="https://wa.me/528281136652" style={{ color: "#7f6d8a" }}>Escribir por WhatsApp</a></p>
        </main>
      </body>
    </html>
  );
}
