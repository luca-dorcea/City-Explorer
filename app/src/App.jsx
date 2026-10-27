import { destinatii } from './data/destinatii.js'
import ListaDestinatii from './components/ListaDestinatii.jsx'
import './App.css'

export default function App() {
  return (
    <main>
      <h1>City Explorer</h1>
      <ListaDestinatii destinatii={destinatii} />
    </main>
  )
}
