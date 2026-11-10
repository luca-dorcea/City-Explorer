// portul 3001 din lucrare este ocupat pe acest calculator de alt proiect,
// deci serverul de test rulează pe 3003: npx json-server db.json --port 3003
const API_URL = 'http://localhost:3003'

// GET /destinatii, paginat: întoarce obiectul { pages, items, data, ... }, nu doar lista
export async function getDestinatii(pagina) {
  const response = await fetch(`${API_URL}/destinatii?_page=${pagina}&_per_page=20`)

  if (!response.ok) {
    throw new Error(`Serverul a răspuns cu ${response.status}`)
  }

  return response.json()
}

// POST /destinatii: serverul întoarce obiectul salvat, cu id-ul generat de el
export async function postDestinatie(d) {
  const response = await fetch(`${API_URL}/destinatii`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(d),
  })

  if (!response.ok) {
    throw new Error(`Serverul a răspuns cu ${response.status}`)
  }

  return response.json()
}

// PATCH /destinatii/:id: se schimbă doar câmpul vizitat
export async function patchVizitat(id, vizitat) {
  const response = await fetch(`${API_URL}/destinatii/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ vizitat }),
  })

  if (!response.ok) {
    throw new Error(`Serverul a răspuns cu ${response.status}`)
  }

  return response.json()
}
