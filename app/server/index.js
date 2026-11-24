import express from 'express'
import cors from 'cors'
import { pool } from './db.js'

const app = express()

// pentru fișă: terminalul devine lista a tot ce cere pagina
app.use((req, res, next) => {
  console.log(req.method, req.originalUrl)
  next()
})

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

const port = Number(process.env.PORT) || 3000

app.listen(port, () => {
  console.log(`API pornit pe http://localhost:${port}`)
})
