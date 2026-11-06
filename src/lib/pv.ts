/**
 * Per-URL value for shared templates: WordPress renders tiny differences in the
 * same header/footer depending on the current URL (active menu item, lazy
 * images…). The generator emits `pv(path, { "/blog/": x }, default)`.
 */
export function pv<T>(path: string, byPath: Record<string, T>, fallback: T): T {
  return Object.prototype.hasOwnProperty.call(byPath, path) ? byPath[path] : fallback;
}
