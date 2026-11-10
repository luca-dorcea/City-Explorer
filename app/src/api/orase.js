const API_URL = 'http://localhost:3001'

export async function getOrase() {
  const response = await fetch(`${API_URL}/orase`)

  if (!response.ok) {
    throw new Error(`Serverul a răspuns cu ${response.status}`)
  }

  return response.json()
}

// cererea care trimite date: metoda, antetul și corpul transformat în text
export async function postOras(oras) {
  const response = await fetch(`${API_URL}/orase`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(oras),
  })

  if (!response.ok) {
    throw new Error(`Serverul a răspuns cu ${response.status}`)
  }

  return response.json()
}
