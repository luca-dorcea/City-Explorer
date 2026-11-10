export default function Cautare({ valoare, onChange }) {
  return (
    <div className="cautare">
      {/* input-ul controlat: textul stă în starea lui App */}
      <input
        type="search"
        placeholder="Caută după oraș sau țară"
        value={valoare}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}
