import { pool } from './db.js'

// scrie în tabela jurnal un rând pentru fiecare cerere terminată
export function jurnal(req, res, next) {
  const inceput = process.hrtime.bigint()
  // calea se reține aici: req.path se schimbă în interiorul unui router
  const metoda = req.method
  const cale = req.originalUrl

  // statusul și durata se cunosc abia după ce răspunsul a plecat
  res.on('finish', async () => {
    const durata = Number(process.hrtime.bigint() - inceput) / 1e6

    // o eroare de aici nu mai poate deveni răspuns, deci se prinde pe loc
    try {
      await pool.query(
        'INSERT INTO jurnal (metoda, cale, status, durata_ms) VALUES (?, ?, ?, ?)',
        [metoda, cale, res.statusCode, Math.round(durata)],
      )
    } catch (error) {
      console.error('Jurnal: nu am putut scrie rândul:', error.message)
    }
  })

  next()
}
