import { useState } from 'react'

// întoarce un obiect cu mesaje; un câmp corect nu apare în el
function valideaza(valori) {
  const erori = {}

  if (valori.oras.trim().length < 2) {
    erori.oras = 'Orașul are cel puțin două caractere.'
  }

  if (valori.tara.trim() === '') {
    erori.tara = 'Țara este obligatorie.'
  }

  const zile = Number(valori.zile)
  if (valori.zile === '' || Number.isNaN(zile) || zile < 1 || zile > 30) {
    erori.zile = 'Numărul de zile este între 1 și 30.'
  }

  return erori
}

const GOL = { oras: '', tara: '', zile: '' }

export default function FormularDestinatie({ onAdd, seTrimite }) {
  // toate valorile într-un singur obiect, toate pornind de la șirul vid
  const [valori, setValori] = useState(GOL)
  const [erori, setErori] = useState({})

  // un singur onChange: atributul name spune ce proprietate se schimbă
  function handleChange(event) {
    const { name, value } = event.target
    setValori((curent) => ({ ...curent, [name]: value }))
  }

  async function handleSubmit(event) {
    // altfel browserul reîncarcă pagina și starea se pierde
    event.preventDefault()

    const gasite = valideaza(valori)
    setErori(gasite)
    if (Object.keys(gasite).length > 0) return

    // fără id: îl generează serverul
    await onAdd({
      oras: valori.oras.trim(),
      tara: valori.tara.trim(),
      zile: Number(valori.zile),
      vizitat: false,
    })

    // câmpurile se golesc pentru următoarea adăugare
    setValori(GOL)
  }

  return (
    <form className="formular" onSubmit={handleSubmit} noValidate>
      <div className="camp">
        <input
          name="oras"
          placeholder="Oraș"
          value={valori.oras}
          onChange={handleChange}
          className={erori.oras ? 'invalid' : ''}
        />
        {erori.oras && <p className="eroare-camp">{erori.oras}</p>}
      </div>
      <div className="camp">
        <input
          name="tara"
          placeholder="Țară"
          value={valori.tara}
          onChange={handleChange}
          className={erori.tara ? 'invalid' : ''}
        />
        {erori.tara && <p className="eroare-camp">{erori.tara}</p>}
      </div>
      <div className="camp">
        <input
          type="number"
          name="zile"
          placeholder="Zile"
          value={valori.zile}
          onChange={handleChange}
          className={erori.zile ? 'invalid' : ''}
        />
        {erori.zile && <p className="eroare-camp">{erori.zile}</p>}
      </div>
      <button type="submit" disabled={seTrimite}>
        {seTrimite ? 'Se trimite...' : 'Adaugă'}
      </button>
    </form>
  )
}
