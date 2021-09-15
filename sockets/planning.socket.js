const fs = require('fs')
const path = require('path')
const { v4: uuidV4 } = require('uuid')

module.exports = (io) => {
  io.on('connection', (socket) => {
    socket.on('joinPlanningRoom', (data) => {
      const readFileData = fs.readFileSync(
        path.join(process.env.PWD, 'data', `${data.planningRoomId}.json`)
      )
      const parsedData = JSON.parse(readFileData)

      if (planningRoomToken !== parsedData.adminId) {
        const userId = uuidV4()
        const userToken = uuidV4()

        parsedData.roomData.users.push({
          id: userId,
          name: data.name,
          isSpectator: data.isSpectator,
        })
        parsedData.tokens[userToken] = userId

        fs.writeFileSync(
          path.join(process.env.PWD, 'data', `${data.planningRoomId}.json`),
          JSON.stringify(parsedData)
        )
      }

      socket.join(data.planningRoomId)
      io.in(data.planningRoomId).emit('newUserJoined', {
        ...parsedData.roomData,
      })
    })
  })
}
