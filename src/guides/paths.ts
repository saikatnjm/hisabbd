/** Guides hub, e.g. "/guides" (Bangla: "/bn/guides" via localePath). */
export const GUIDES_PATH = "/guides";

/** URL path for a guide, e.g. "land-measurement-units" → "/guides/land-measurement-units". */
export function guidePath(slug: string): string {
  return `${GUIDES_PATH}/${slug}`;
}
