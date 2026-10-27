import { useState } from 'react'
import { destinatii as destinatiiInitiale } from './data/destinatii.js'
import { getNevizitate, totalZile, marcheazaVizitat } from './utils/destinatii.js'
import Rezumat from './components/Rezumat.jsx'
import ListaDestinatii from './components/ListaDestinatii.jsx'
import './App.css'

export default function App() {
  // lista stă în stare, ca să poată fi modificată
  const [destinatii, setDestinatii] = useState(destinatiiInitiale)

  // funcția care chiar schimbă starea; cardul doar o apelează
  function handleToggle(id) {
    setDestinatii((curent) => marcheazaVizitat(curent, id))
  }

  return (
    <main>
      <h1>City Explorer</h1>
      {/* numerele se calculează din stare la fiecare desenare */}
      <Rezumat
        total={destinatii.length}
        nevizitate={getNevizitate(destinatii).length}
        zile={totalZile(getNevizitate(destinatii))}
      />
      <ListaDestinatii destinatii={destinatii} onToggle={handleToggle} />
    </main>
  )
}
