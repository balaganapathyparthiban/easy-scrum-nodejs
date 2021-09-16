const fs = require('fs')
const path = require('path')
const { v4: uuidV4 } = require('uuid')

module.exports = (io) => {
  io.on('connection', (socket) => {
    socket.on('joinPlanningRoom', (data) => {
      let readFileData

      try {
        readFileData = fs.readFileSync(
          path.join(process.env.PWD, 'data', `${data.planningRoomId}.json`)
        )
      } catch {
        return
      }

      const parsedData = JSON.parse(readFileData)

      if (!parsedData.tokens[data.planningRoomToken]) {
        const userId = uuidV4()
        const userToken = data.planningRoomToken

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
      io.in(data.planningRoomId).emit('updatedRoomData', {
        ...parsedData.roomData,
      })
    })
  })
}
