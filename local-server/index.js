const express = require('express')
const proxy = require('express-http-proxy')

const FUNCTIONS_PORT = 34877

const app = express()
const port = 3000

app.use('/.netlify/functions', proxy(`http://localhost:${FUNCTIONS_PORT}`))
app.use('/', proxy('http://localhost:8888'))

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`),
)
