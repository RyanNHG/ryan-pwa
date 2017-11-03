const express = require('express')
const enforce = require('express-sslify')
const path = require('path')

const app = express()
const port = process.env.PORT || 3000

if (process.env.NODE_ENV === 'production') {
  enforce.HTTPS({ trustProtoHeader: true })
}

app.use('/public', express.static(path.join(__dirname, 'public')))

app.get('/service-worker.js', (req, res) =>
  res.sendFile(path.join(__dirname, 'public', 'service-worker.js'))
)

app.get('/', (_req, res) =>
  res.sendFile(path.join(__dirname, 'index.html'))
)

app.listen(port, () => console.log(`Ready at http://localhost:${port}`))
