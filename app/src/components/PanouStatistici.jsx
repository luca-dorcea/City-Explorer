import { useEffect, useState } from 'react'
import { getStatistici } from '../api/statistici.js'

// Laboratorul 5: cifrele nu se mai calculează în pagină, ci în SQL,
// pe server, la ruta /api/statistici. O cerere la fiecare tastare.
export default function PanouStatistici() {
  const [prag, setPrag] = useState('3')
  const [tara, setTara] = useState('')
  const [cifre, setCifre] = useState(null)
  const [eroare, setEroare] = useState(null)

  useEffect(() => {
    async function incarca() {
      try {
        setCifre(await getStatistici(prag, tara.trim()))
        setEroare(null)
      } catch (err) {
        setEroare(err.message)
      }
    }

    incarca()
  }, [prag, tara])

  return (
    <section className="panou">
      <h2>Statistici</h2>

      <label>
        Cel puțin{' '}
        <input
          type="number"
          value={prag}
          onChange={(e) => setPrag(e.target.value)}
        />{' '}
        zile
      </label>{' '}
      <label>
        Țara{' '}
        <input
          className="panou-tara"
          placeholder="toate"
          value={tara}
          onChange={(e) => setTara(e.target.value)}
        />
      </label>

      {eroare && <p className="stare eroare">Statistici indisponibile: {eroare}</p>}

      {!eroare && cifre && cifre.destinatii === 0 && (
        <p className="gol">Nicio destinație cu cel puțin {prag} zile.</p>
      )}

      {!eroare && cifre && cifre.destinatii > 0 && (
        <ul>
          <li>Destinații: {cifre.destinatii}</li>
          <li>Total zile: {cifre.zile}</li>
          <li>Media: {cifre.medie} zile</li>
        </ul>
      )}
    </section>
  )
}
