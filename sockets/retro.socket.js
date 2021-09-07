const processRetroRoom = (io, socket, room) => {
  // socket.on(room, ())
}

module.exports = (io) => {
  io.on('connection', (socket) => {
    socket.on('join', (data) => {
      socket.join(data)
      processRetroRoom(io, socket, data)
    })
  })
}
