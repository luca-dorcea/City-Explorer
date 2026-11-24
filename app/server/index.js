import express from 'express'
import cors from 'cors'
import { pool } from './db.js'
import { jurnal } from './jurnal.js'
import statistici from './rute/statistici.js'
import raportJurnal from './rute/jurnal.js'

const app = express()

// pentru fișă: terminalul devine lista a tot ce cere pagina
app.use((req, res, next) => {
  console.log(req.method, req.originalUrl)
  next()
})

// înaintea lui cors(): cors() răspunde singur la OPTIONS, fără next(),
// deci un jurnal scris după el nu ar vedea cererile de verificare
app.use(jurnal)
app.use(cors()) // permite paginii să folosească răspunsul
app.use(express.json()) // citește corpul cererilor POST și PATCH

// convertește un rând din tabelă în forma așteptată de interfață
const deTrimis = (d) => ({ ...d, id: String(d.id), vizitat: Boolean(d.vizitat) })

// ----- Exercițiul 1: citirea datelor -----

app.get('/api/destinatii', async (req, res) => {
  const [randuri] = await pool.query(
    'SELECT id, oras, tara, zile, vizitat FROM destinatii ORDER BY id',
  )

  res.json(randuri.map(deTrimis))
})

// ruta de ecou, temporară, pentru punctul 1 al fișei
app.all('/api/ecou/:id', (req, res) => {
  res.json({ params: req.params, query: req.query, body: req.body })
})

// ----- Exercițiul 2: adăugarea unei destinații -----

app.post('/api/destinatii', async (req, res) => {
  const { oras, tara, zile } = req.body

  // se verifică din nou: validarea din interfață poate fi ocolită
  const textValid = (v) => typeof v === 'string' && v.trim() !== ''
  if (!textValid(oras) || !textValid(tara) || !Number.isInteger(zile) || zile < 1 || zile > 30) {
    return res.status(400).json({ eroare: 'Date invalide.' })
  }

  const [rezultat] = await pool.query(
    'INSERT INTO destinatii (oras, tara, zile, vizitat) VALUES (?, ?, ?, ?)',
    [oras.trim(), tara.trim(), zile, false],
  )

  res.status(201).json({
    id: String(rezultat.insertId),
    oras: oras.trim(),
    tara: tara.trim(),
    zile,
    vizitat: false,
  })
})

// ----- Exercițiul 5: căutarea după oraș, cu parametru -----

app.get('/api/destinatii/caut', async (req, res) => {
  const [randuri] = await pool.query(
    'SELECT id, oras, tara, zile, vizitat FROM destinatii WHERE oras = ?',
    [req.query.oras ?? ''],
  )

  res.json(randuri.map(deTrimis))
})

// ----- Exercițiul 3: marcarea -----

app.patch('/api/destinatii/:id', async (req, res) => {
  const { vizitat } = req.body

  if (typeof vizitat !== 'boolean') {
    return res.status(400).json({ eroare: 'Câmpul vizitat trebuie să fie true sau false.' })
  }

  const [rezultat] = await pool.query(
    'UPDATE destinatii SET vizitat = ? WHERE id = ?',
    [vizitat, req.params.id],
  )

  // niciun rând atins: identificatorul nu există
  if (rezultat.affectedRows === 0) {
    return res.status(404).json({ eroare: 'Destinația nu există.' })
  }

  const [randuri] = await pool.query(
    'SELECT id, oras, tara, zile, vizitat FROM destinatii WHERE id = ?',
    [req.params.id],
  )

  res.json(deTrimis(randuri[0]))
})

app.use('/api/statistici', statistici)
app.use('/api/jurnal', raportJurnal)

const port = Number(process.env.PORT) || 3000

app.listen(port, () => {
  console.log(`API pornit pe http://localhost:${port}`)
})
