const processPlanningRoom = (io, socket, room) => {
  // socket.on(room, ())
}

module.exports = (io) => {
  io.on('connection', (socket) => {
    socket.on('join', (data) => {
      socket.join(data)
      processPlanningRoom(io, socket, data)
    })
  })
}
