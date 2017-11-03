const express = require('express')
const app = express()
const path = require('path')

app.use('/public', express.static(path.join(__dirname, 'public')))

app.get('/service-worker.js', (req, res) =>
  res.sendFile(path.join(__dirname, 'public', 'service-worker.js'))
)

app.get('/', (_req, res) =>
  res.sendFile(path.join(__dirname, 'index.html'))
)

app.listen(3000, () => console.log(`Ready at http://localhost:3000`))
