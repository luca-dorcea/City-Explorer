import { useState } from 'react'

export default function FormularDestinatie({ onAdd }) {
  // fiecare câmp își ține valoarea în stare, pornind de la șirul vid
  const [oras, setOras] = useState('')
  const [tara, setTara] = useState('')
  const [zile, setZile] = useState('')

  function handleSubmit(event) {
    // altfel browserul reîncarcă pagina și starea se pierde
    event.preventDefault()

    // orașul și țara sunt obligatorii
    if (!oras.trim() || !tara.trim()) return

    onAdd({
      id: crypto.randomUUID(),
      oras: oras.trim(),
      tara: tara.trim(),
      zile: Number(zile), // câmpurile întorc text
      vizitat: false,
    })

    // câmpurile se golesc pentru următoarea adăugare
    setOras('')
    setTara('')
    setZile('')
  }

  return (
    <form className="formular" onSubmit={handleSubmit}>
      <input
        placeholder="Oraș"
        value={oras}
        onChange={(e) => setOras(e.target.value)}
      />
      <input
        placeholder="Țară"
        value={tara}
        onChange={(e) => setTara(e.target.value)}
      />
      <input
        type="number"
        min="1"
        placeholder="Zile"
        value={zile}
        onChange={(e) => setZile(e.target.value)}
      />
      <button type="submit">Adaugă</button>
    </form>
  )
}
