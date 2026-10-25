import assert from 'node:assert/strict';

// Streaming can return HTTP 200 for a rendered Next.js not-found page.
export function assertPublicPage({ status, headings, body }, href) {
  assert(status >= 200 && status < 400, `${href}: HTTP ${status}`);
  assert(headings.length > 0, `${href}: missing page heading`);
  assert(!headings.some(h => /^404$|^500$/.test(h.trim())), `${href}: rendered error despite HTTP ${status}`);
  assert(!/This page could not be found\.|Application error:|No pudimos cargar este producto\./.test(body), `${href}: error content`);
}

export function productTargets(source) {
  return [...new Set([
    ...[...source.matchAll(/\]\(\/productos\/([^\s)#?]+)[^)]*\)/g)].map(m => m[1]),
    ...[...source.matchAll(/<ProductEmbed\b[^>]*\bhandle="([^"]+)"/g)].map(m => m[1]),
  ])];
}

export function assertPublishedTargets(source, publishedHandles, file) {
  for (const handle of productTargets(source)) assert(publishedHandles.has(handle), `${file}: unpublished product ${handle}`);
}
