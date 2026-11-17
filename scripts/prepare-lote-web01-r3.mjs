import { createRequire } from 'node:module';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, dirname, relative } from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';

const require = createRequire(import.meta.url), sharp = require('sharp');
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const argument = name => {
  const index = args.indexOf(name);
  assert.ok(index >= 0 && args[index + 1] && !args[index + 1].startsWith('--'), `Pass ${name}`);
  return resolve(args[index + 1]);
};
const originals = argument('--originals'), evidence = argument('--evidence');
assert.ok(relative(root, evidence).startsWith('..'), 'Keep evidence and lossy proposals OUTSIDE the repository.');
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const config = JSON.parse(await readFile(root + '/docs/catalog/lote-web-01-r3/placement.json', 'utf8'));
const maskBytes = await readFile(root + '/docs/catalog/lote-web-01-r2/masks.json');
assert.equal(hash(maskBytes), config.approved_mask_sha256, 'APPROVED_MASK_CHANGED');
const masks = JSON.parse(maskBytes);
const r1 = JSON.parse(await readFile(root + '/docs/catalog/lote-web-01/assets.json', 'utf8'));
const r2 = JSON.parse(await readFile(root + '/docs/catalog/lote-web-01-r2/assets.json', 'utf8'));
await mkdir(evidence + '/optimizados-propuesta-no-publicar', { recursive: true });
const assets = [], candidates = [];

for (const item of r1.assets) {
  const previous = r2.assets.find(a => a.source.drive_id === item.source.drive_id);
  assert.equal(hash(await readFile(root + '/' + item.path)), item.sha256, 'R1_CHANGED');
  assert.equal(hash(await readFile(root + '/' + previous.path)), previous.sha256, 'R2_CHANGED');
  const bytes = await readFile(resolve(originals, item.source.drive_id + '.jpg'));
  assert.equal(hash(bytes), item.source.sha256, 'ORIGINAL_HASH_MISMATCH');
  const mask = masks.assets.find(m => m.drive_id === item.source.drive_id);
  const profile = config.profiles[item.handle];
  assert.ok(mask && profile);
  const { data: source, info } = await sharp(bytes).rotate().toColourspace('srgb').ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  assert.equal(info.width, 3024); assert.equal(info.height, 4032);
  const svg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${info.width}" height="${info.height}" viewBox="0 0 1368 1824"><path fill="white" d="${mask.path}"/></svg>`);
  const alpha = await sharp(svg).extractChannel(3).raw().toBuffer();
  const rgba = Buffer.from(source);
  let minX = info.width, minY = info.height, maxX = 0, maxY = 0, weight = 0, weightedX = 0, changedRGB = 0;
  for (let y = 0; y < info.height; y++) for (let x = 0; x < info.width; x++) {
    const i = y * info.width + x, a = alpha[i];
    rgba[i * 4 + 3] = a;
    if (a > 0) {
      minX = Math.min(minX, x); maxX = Math.max(maxX, x);
      minY = Math.min(minY, y); maxY = Math.max(maxY, y);
      weight += a; weightedX += x * a;
    }
    for (let c = 0; c < 3; c++) if (source[i * 4 + c] !== rgba[i * 4 + c]) changedRGB++;
  }
  assert.equal(changedRGB, 0);
  const box = { left: minX, top: minY, width: maxX - minX + 1, height: maxY - minY + 1 };
  assert.deepEqual(box, previous.bounds_native, 'MASK_OR_CROP_CHANGED');
  assert.ok(box.height > profile.height, 'NO_UPSCALING');
  const crop = await sharp(rgba, { raw: { width: info.width, height: info.height, channels: 4 } })
    .extract(box).resize({ height: profile.height, kernel: 'lanczos3', withoutEnlargement: true }).png().toBuffer();
  const meta = await sharp(crop).metadata();
  const scale = meta.height / box.height;
  const left = Math.round(800 - (weightedX / weight - box.left) * scale), top = profile.base - meta.height;
  assert.ok(top >= 64 && profile.base <= 1536 && left > 0 && left + meta.width < 1600, 'UNSAFE_MARGIN');
  const path = item.path.replace('.webp', '-r3.webp');
  const rendered = await sharp({ create: { width: 1600, height: 1600, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([{ input: crop, left, top }]).png().toBuffer();
  const final = await sharp(rendered).webp({ lossless: true, effort: 6 }).toBuffer();
  const decoded = await sharp(final).ensureAlpha().raw().toBuffer();
  const expected = await sharp(rendered).ensureAlpha().raw().toBuffer();
  for (let i = 0; i < decoded.length; i += 4) {
    assert.equal(decoded[i + 3], expected[i + 3]);
    if (expected[i + 3] > 0) for (let c = 0; c < 3; c++) assert.equal(decoded[i + c], expected[i + c], 'LOSSLESS_PIXEL_MISMATCH');
  }
  await writeFile(root + '/' + path, final);
  const asset = {
    handle: item.handle, role: item.role, path, source: item.source,
    width: 1600, height: 1600, format: 'webp', lossless: true, has_alpha: true,
    bytes: final.length, sha256: hash(final), mask_sha256: hash(maskBytes),
    bounds_native: box, placement: { left, top, rendered_width: meta.width, rendered_height: meta.height, base: profile.base, canvas: 1600 },
    source_sha256_unchanged: true, r1_sha256_unchanged: true, r2_sha256_unchanged: true,
    rgb_changes_before_resize: changedRGB, generative_ai: false, product_reconstructed: false,
    label_reconstructed: false, exposure_ev: 0, color_adjustments: false, shadow_baked: false, background_baked: false,
    human_review: mask.review,
  };
  assets.push(asset);
  // A lossy candidate is a separate, LOCAL proposal. Never replace the lossless master.
  const optimized = await sharp(final).webp({ quality: 95, effort: 6, smartSubsample: true }).toBuffer();
  const candidateName = item.handle + '-' + item.role + '-r3-q95.webp';
  await writeFile(evidence + '/optimizados-propuesta-no-publicar/' + candidateName, optimized);
  const candidateRaw = await sharp(optimized).ensureAlpha().raw().toBuffer();
  let errors = 0, squareErrors = 0, channels = 0;
  for (let i = 0; i < decoded.length; i += 4) {
    assert.equal(candidateRaw[i + 3], decoded[i + 3], 'LOSSY_ALPHA_CHANGED');
    if (decoded[i + 3] === 255) for (let c = 0; c < 3; c++) {
      const d = candidateRaw[i + c] - decoded[i + c];
      errors += Math.abs(d); squareErrors += d * d; channels++;
    }
  }
  candidates.push({ handle: item.handle, role: item.role, filename: candidateName, width: 1600, height: 1600, quality: 95,
    bytes: optimized.length, sha256: hash(optimized), master_sha256: asset.sha256,
    reduction_percent: +(100 * (1 - optimized.length / final.length)).toFixed(2),
    opaque_rgb_mae: +(errors / channels).toFixed(4), opaque_rgb_psnr_db: +(10 * Math.log10(255 ** 2 / (squareErrors / channels))).toFixed(2),
    alpha_identical: true, published: false, state: 'LOCAL_PROPOSAL_PENDING_VISUAL_REVIEW' });
  console.log(JSON.stringify({ asset: item.handle + '/' + item.role, height: meta.height, top, base: profile.base, master_bytes: final.length, candidate_bytes: optimized.length }));
}
const manifest = { schema_version: 1, state: 'PENDING_VISUAL_APPROVAL', changes: 'scale and placement only; original R2 masks unchanged', tool: { sharp: sharp.versions.sharp, vips: sharp.versions.vips, webp: sharp.versions.webp }, assets };
await writeFile(root + '/docs/catalog/lote-web-01-r3/assets.json', JSON.stringify(manifest, null, 2) + '\n');
await writeFile(evidence + '/optimizados-propuesta-no-publicar/manifest.json', JSON.stringify({ published: false, candidates }, null, 2) + '\n');
