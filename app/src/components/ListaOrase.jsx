import { useEffect, useState } from 'react'
import { getOrase } from '../api/orase.js'

export default function ListaOrase() {
  // cele trei stări ale unei cereri: datele, încărcarea, eroarea
  const [orase, setOrase] = useState([])
  const [incarcare, setIncarcare] = useState(true)
  const [eroare, setEroare] = useState(null)

  useEffect(() => {
    // funcția dată lui useEffect nu poate fi async, deci se declară una înăuntru
    async function incarca() {
      try {
        const date = await getOrase()
        setOrase(date)
      } catch (error) {
        setEroare(error.message)
      } finally {
        // rulează și la reușită, și la eroare
        setIncarcare(false)
      }
    }

    incarca()
  }, [])

  if (incarcare) return <p>Se încarcă...</p>
  if (eroare) return <p>A apărut o eroare: {eroare}</p>

  return (
    <ul>
      {orase.map((o) => (
        <li key={o.id}>{o.oras}, {o.tara} - {o.pret} euro</li>
      ))}
    </ul>
  )
}
