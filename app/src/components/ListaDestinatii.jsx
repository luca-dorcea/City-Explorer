import DestinatieCard from './DestinatieCard.jsx'

export default function ListaDestinatii({ destinatii }) {
  // lista goală: un mesaj în locul grilei
  if (destinatii.length === 0) {
    return <p className="info">Nu există nicio destinație.</p>
  }

  return (
    <div className="lista">
      {destinatii.map((destinatie) => (
        <DestinatieCard key={destinatie.id} destinatie={destinatie} />
      ))}
    </div>
  )
}
