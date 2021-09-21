process.env.PWD = __dirname

const express = require('express')
const http = require('http')
const socket = require('socket.io')
const helmet = require('helmet')
const cors = require('cors')

const app = express()

/* MIDDLEWARES */
app.use(helmet())
app.use(cors())

/* INITIALIZE SERVER & SOCKET */
const httpServer = http.createServer(app)
const io = socket(httpServer, {
  cors: '*',
})

/* ROUTER INITIALIZE */
const router = require('./routes')
const { clearDataJob } = require('./cron')
app.use(router)

/* SOCKET NAMESPACES */
const planningIo = io.of('/planning-io')
const retroIo = io.of('/retro-io')

require('./sockets/planning')(planningIo)
require('./sockets/retro')(retroIo)

/* START CRON */
clearDataJob.start()

/* SERVER LISTENING */
httpServer.listen('8080', () => console.log('Server listening at port 8080'))
