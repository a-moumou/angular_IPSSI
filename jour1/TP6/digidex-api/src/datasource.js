/**
 * Couche d'accès à l'API REST publique digi-api.com (fetch).
 */
const BASE = 'https://digi-api.com/api/v1';

/** Liste paginée avec filtre nom optionnel */
export async function fetchDigimons({ page, pageSize, name }) {
  let url = `${BASE}/digimon?page=${page}&pageSize=${pageSize}`;
  if (name) url += `&name=${encodeURIComponent(name)}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Erreur API: ${res.status}`);
  const data = await res.json();

  return {
    items: data.content.map(d => ({ id: d.id, name: d.name, image: d.image })),
    totalElements: data.pageable?.totalElements,
    totalPages: data.pageable?.totalPages,
    currentPage: data.pageable?.currentPage,
  };
}

/** Détail par id ou par nom (404 → null) */
export async function fetchDigimon(idOrName) {
  const res = await fetch(`${BASE}/digimon/${idOrName}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Erreur API: ${res.status}`);
  return res.json();
}
