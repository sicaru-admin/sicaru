import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import sharp from "sharp";

// Diagnostic only: no product identity/media association changes.
// R3 WebP can contain brightly coloured RGB data under alpha=0; only *visible*
// alpha matters. Never call transparent garbage a visual defect without testing.
for (const side of ["01-principal-r3.webp", "02-reverso-r3.webp"]) {
  test(`NEKANE Morazul R3 ${side}: sin bandas opacas fuera del envase`, async () => {
    const file = new URL(`../public/images/products/nekane-morazul-shampoo-matizador-300g/${side}`, import.meta.url);
    const buffer = await readFile(file);
    const meta = await sharp(buffer).metadata();
    assert.equal(meta.format, "webp");
    assert.ok(meta.hasAlpha, "El WebP R3 debe conservar canal alfa");

    const { data, info } = await sharp(buffer).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const { width, height, channels } = info;
    assert.ok(width >= 800 && height >= 800, "Resolución insuficiente para ficha");
    const at = (x, y) => data[(y * width + x) * channels + 3];

    // Entire right margin is outside the body of the centered bottle.
    let visibleRight = 0, checked = 0;
    const left = Math.floor(width * 0.72);
    for (let y = Math.floor(height * 0.09); y < Math.floor(height * 0.92); y += 2) {
      for (let x = left; x < width; x += 2) {
        checked++;
        if (at(x, y) > 8) visibleRight++;
      }
    }
    // Opaque bands or rectangles in this region indicate bad export.
    assert.equal(visibleRight, 0, `Banda visible en margen derecho: ${visibleRight}/${checked} píxeles alfa>8`);
    const center = at(Math.floor(width / 2), Math.floor(height / 2));
    assert.ok(center > 200, "Falta producto en el centro o el recorte está vacío");
    console.log(JSON.stringify({ asset: side, width, height, alphaCenter: center, visibleRight, sampled: checked }));
  });
}
