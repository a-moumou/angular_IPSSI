export function extractIdFromUrl(url: string): number | null {
  if (!url) {
    return null;
  }
  const segment = url.split('/').pop();
  if (!segment) {
    return null;
  }
  const id = Number(segment);
  return Number.isNaN(id) ? null : id;
}
