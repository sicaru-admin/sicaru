"use client";

const WHATSAPP_NUMBER = "528281111023";
const MESSAGE =
  "\u00a1Hola! Me interesa saber m\u00e1s sobre los productos de Sicar\u00fa \ud83d\udc9c";

export function WhatsAppButton() {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(MESSAGE)}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex h-[60px] w-[60px] items-center justify-center rounded-full bg-[#25D366] shadow-lg transition-transform hover:scale-110"
      aria-label="Contactar por WhatsApp"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        className="h-8 w-8 fill-white"
      >
        <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16c0 3.5 1.128 6.744 3.046 9.378L1.054 31.29l6.118-1.958A15.9 15.9 0 0016.004 32C24.826 32 32 24.822 32 16S24.826 0 16.004 0zm9.31 22.596c-.39 1.1-1.932 2.014-3.168 2.28-.846.18-1.95.324-5.67-1.218-4.762-1.97-7.826-6.81-8.064-7.124-.23-.314-1.932-2.574-1.932-4.908s1.224-3.484 1.658-3.96c.434-.476.948-.596 1.264-.596.314 0 .63.002.904.016.29.014.68-.11 1.064.812.39.94 1.328 3.244 1.444 3.48.116.236.194.512.038.826-.154.314-.232.51-.464.786-.232.274-.488.612-.696.822-.232.232-.474.484-.204.948.27.464 1.2 1.98 2.578 3.208 1.77 1.578 3.262 2.068 3.726 2.302.464.234.734.196 1.004-.118.27-.314 1.156-1.35 1.464-1.814.31-.464.618-.386 1.042-.232.424.156 2.702 1.274 3.166 1.506.464.234.774.35.89.544.116.194.116 1.118-.274 2.218z" />
      </svg>
    </a>
  );
}
