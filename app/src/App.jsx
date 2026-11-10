import { useEffect, useState } from 'react'
import { getNevizitate, totalZile, adaugaDestinatie } from './utils/destinatii.js'
import { getDestinatii, postDestinatie, patchVizitat } from './api/destinatii.js'
import Rezumat from './components/Rezumat.jsx'
import FormularDestinatie from './components/FormularDestinatie.jsx'
import ListaDestinatii from './components/ListaDestinatii.jsx'
import './App.css'

export default function App() {
  // lista vine acum de la server; cele trei stări ale cererii
  const [destinatii, setDestinatii] = useState([])
  const [incarcare, setIncarcare] = useState(true)
  const [eroare, setEroare] = useState(null)
  // true cât timp cererea POST este în curs; butonul formularului e dezactivat
  const [seTrimite, setSeTrimite] = useState(false)

  // încărcarea la pornire: lista de dependențe goală, deci o singură dată
  useEffect(() => {
    async function incarca() {
      try {
        const lista = await getDestinatii()
        setDestinatii(lista)
      } catch (error) {
        setEroare(error.message)
      } finally {
        setIncarcare(false)
      }
    }

    incarca()
  }, [])

  // întâi modificarea pe server, apoi în stare se pune obiectul întors de el
  async function handleToggle(id) {
    const veche = destinatii.find((d) => d.id === id)

    try {
      const salvata = await patchVizitat(id, !veche.vizitat)
      setDestinatii((curent) => curent.map((d) => (d.id === id ? salvata : d)))
    } catch (error) {
      setEroare(error.message)
    }
  }

  // trimite destinația la server; în stare se pune obiectul întors, cu id-ul lui
  async function handleAdd(destinatie) {
    setSeTrimite(true)

    try {
      const salvata = await postDestinatie(destinatie)
      setDestinatii((curent) => adaugaDestinatie(curent, salvata))
    } catch (error) {
      setEroare(error.message)
    } finally {
      setSeTrimite(false)
    }
  }

  return (
    <main>
      <h1>City Explorer</h1>
      {incarcare && <p className="stare">Se încarcă destinațiile...</p>}
      {!incarcare && eroare && (
        <p className="stare eroare">Nu am putut încărca datele: {eroare}</p>
      )}
      {!incarcare && !eroare && (
        <>
          {/* numerele se calculează din stare la fiecare desenare */}
          <Rezumat
            total={destinatii.length}
            nevizitate={getNevizitate(destinatii).length}
            zile={totalZile(getNevizitate(destinatii))}
          />
          <FormularDestinatie onAdd={handleAdd} seTrimite={seTrimite} />
          <ListaDestinatii destinatii={destinatii} onToggle={handleToggle} />
        </>
      )}
    </main>
  )
}
