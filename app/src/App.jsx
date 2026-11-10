import { useEffect, useState } from 'react'
import { getNevizitate, totalZile, adaugaDestinatie } from './utils/destinatii.js'
import { getDestinatii, postDestinatie, patchVizitat } from './api/destinatii.js'
import Rezumat from './components/Rezumat.jsx'
import FormularDestinatie from './components/FormularDestinatie.jsx'
import ListaDestinatii from './components/ListaDestinatii.jsx'
import Cautare from './components/Cautare.jsx'
import './App.css'

export default function App() {
  // lista vine acum de la server; cele trei stări ale cererii
  const [destinatii, setDestinatii] = useState([])
  const [incarcare, setIncarcare] = useState(true)
  const [eroare, setEroare] = useState(null)
  // true cât timp cererea POST este în curs; butonul formularului e dezactivat
  const [seTrimite, setSeTrimite] = useState(false)
  // textul din câmpul de căutare
  const [cautare, setCautare] = useState('')
  // paginarea: pagina curentă și numărul total de pagini, primit de la server
  const [pagina, setPagina] = useState(1)
  const [totalPagini, setTotalPagini] = useState(1)

  // pagina intră în lista de dependențe: la fiecare schimbare pleacă o cerere nouă
  useEffect(() => {
    async function incarca() {
      try {
        const rezultat = await getDestinatii(pagina)
        // răspunsul nu mai este o listă, ci un obiect cu lista în data
        setDestinatii(rezultat.data)
        setTotalPagini(rezultat.pages)
      } catch (error) {
        setEroare(error.message)
      } finally {
        setIncarcare(false)
      }
    }

    incarca()
  }, [pagina])

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

  // se filtrează doar lista afișată; rezumatul rămâne calculat din toată starea
  const text = cautare.trim().toLowerCase()
  const afisate = destinatii.filter(
    (d) => d.oras.toLowerCase().includes(text) ||
      d.tara.toLowerCase().includes(text),
  )

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
          <Cautare valoare={cautare} onChange={setCautare} />
          {/* întâi: există vreo destinație? abia apoi: a lăsat căutarea ceva? */}
          {destinatii.length === 0 && (
            <p className="gol">Nu există nicio destinație. Adaugă prima din formular.</p>
          )}
          {destinatii.length > 0 && afisate.length === 0 && (
            <p className="gol">Niciun rezultat pentru „{cautare.trim()}”.</p>
          )}
          {afisate.length > 0 && (
            <ListaDestinatii destinatii={afisate} onToggle={handleToggle} />
          )}
          <div className="paginare">
            <button
              type="button"
              disabled={pagina === 1}
              onClick={() => setPagina((p) => p - 1)}
            >
              Înapoi
            </button>
            <span>pagina {pagina} din {totalPagini}</span>
            <button
              type="button"
              disabled={pagina === totalPagini}
              onClick={() => setPagina((p) => p + 1)}
            >
              Înainte
            </button>
          </div>
        </>
      )}
    </main>
  )
}
