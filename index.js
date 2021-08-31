const express = require('express')
const http = require('http')
const socket = require('socket.io')
const helmet = require('helmet')
const cors = require('cors')

const app = express()

app.use(helmet())
app.use(cors())

const httpServer = http.createServer(app)
const io = socket(httpServer, {})

httpServer.listen('8080', () => console.log('Server listening at port 8080'))
