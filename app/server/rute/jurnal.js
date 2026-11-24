import { Router } from 'express'
import { pool } from '../db.js'

const router = Router()

// cele mai cerute adrese: metoda, calea, câte cereri și durata medie
router.get('/raport', async (req, res) => {
  const metoda = req.query.metoda ?? ''

  let sql = `SELECT metoda, cale, COUNT(*) AS cereri, ROUND(AVG(durata_ms), 1) AS medie_ms
             FROM jurnal`
  const valori = []

  // filtrul opțional: valoarea se trimite separat, niciodată lipită în text
  if (metoda !== '') {
    sql += ' WHERE metoda = ?'
    valori.push(metoda)
  }

  sql += ' GROUP BY metoda, cale ORDER BY cereri DESC LIMIT 10'

  const [randuri] = await pool.query(sql, valori)

  // COUNT și AVG sosesc ca șiruri, ca orice funcție de agregare
  res.json(randuri.map((r) => ({
    ...r,
    cereri: Number(r.cereri),
    medie_ms: Number(r.medie_ms),
  })))
})

export default router
