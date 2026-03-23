const NORTON_IMAGE_BASE = '/images/reviews/norton/';

function normalizeNortonPath(path: string) {
  if (!path.startsWith(NORTON_IMAGE_BASE)) return path;
  return path.replace(/\.avif$/i, '.png');
}

export function toWebpPath(path: string) {
  const normalized = normalizeNortonPath(path);
  return normalized.replace(/\.png$/i, '.webp');
}

export function enhanceArticleHtml(html: string) {
  if (!html) return html;

  return html.replace(/<img\b([^>]*?)src=["']([^"']+)["']([^>]*?)>/gi, (_match, before, src, after) => {
    if (!src.startsWith(NORTON_IMAGE_BASE)) {
      return `<img${before}src="${src}"${after}>`;
    }

    const normalizedSrc = normalizeNortonPath(src);
    const webpSrc = toWebpPath(normalizedSrc);

    return `<picture><source srcset="${webpSrc}" type="image/webp" /><img${before}src="${normalizedSrc}"${after}></picture>`;
  });
}