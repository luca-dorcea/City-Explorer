import DestinatieCard from './DestinatieCard.jsx'

export default function ListaDestinatii({ destinatii, onToggle }) {
  // lista goală: un mesaj în locul grilei
  if (destinatii.length === 0) {
    return <p className="info">Nu există nicio destinație.</p>
  }

  return (
    <div className="lista">
      {destinatii.map((destinatie) => (
        // onToggle doar trece mai departe, la fiecare card
        <DestinatieCard key={destinatie.id} destinatie={destinatie} onToggle={onToggle} />
      ))}
    </div>
  )
}
