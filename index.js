process.env.PWD = __dirname

const express = require('express')
const http = require('http')
const socket = require('socket.io')
const helmet = require('helmet')
const cors = require('cors')
const path = require('path')

const app = express()

/* MIDDLEWARES */
app.use(helmet())
app.use(
  cors({
    origin: true,
  })
)

/* INITIALIZE SERVER & SOCKET */
const httpServer = http.createServer(app)
const io = socket(httpServer, {
  cors: {
    origin: true,
  },
})

/* WEB APP HOST */
app.use('/', express.static(path.join(__dirname, 'public')))

/* ROUTER INITIALIZE */
const router = require('./routes')
const { clearDataJob } = require('./cron')
app.use(router)

app.get('(/*)?', (_, res) => {
  return res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

/* SOCKET NAMESPACES */
const planningIo = io.of('/planning-io')
const retroIo = io.of('/retro-io')

require('./sockets/planning')(planningIo)
require('./sockets/retro')(retroIo)

/* START CRON */
clearDataJob.start()

/* SERVER LISTENING */
httpServer.listen('5000', () => console.log('Server listening at port 5000'))
