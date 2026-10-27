import Rezumat from './components/Rezumat.jsx'
import './App.css'

export default function App() {
  return (
    <main>
      <h1>City Explorer</h1>
      {/* părintele trimite valorile; cele numerice se pun în acolade */}
      <Rezumat total={6} nevizitate={4} zile={18} />
    </main>
  )
}
