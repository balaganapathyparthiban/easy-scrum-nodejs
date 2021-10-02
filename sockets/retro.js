const { v4: uuidV4 } = require('uuid')
const helper = require('../utils/helper')

module.exports = (io) => {
  io.on('connection', (socket) => {
    let retroRoomId
    let retroRoomToken
    let retroRoomUserId

    socket.on('joinRoom', (data) => {
      if (!data.retroRoomId || !data.retroRoomToken) {
        return
      }

      const parsedData = helper.getParsedJsonData(data.retroRoomId)

      if (!parsedData.tokens[data.retroRoomToken]) {
        if (!data.name) {
          socket.emit('openPersonalDetailsModal', {})
          return
        }

        const userId = uuidV4()
        const userToken = data.retroRoomToken

        parsedData.roomData.users.push({
          id: userId,
          name: data.name,
          isOnline: true,
        })
        parsedData.tokens[userToken] = userId

        helper.writeJsonData(data.retroRoomId, parsedData)
      } else {
        parsedData.roomData.users = parsedData.roomData.users.map((user) => {
          if (user.id === parsedData.tokens[data.retroRoomToken]) {
            user.isOnline = true
          }
          return {
            ...user,
          }
        })

        helper.writeJsonData(data.retroRoomId, parsedData)
      }

      retroRoomId = data.retroRoomId
      retroRoomToken = data.retroRoomToken
      retroRoomUserId = parsedData.tokens[data.retroRoomToken]

      socket.join(data.retroRoomId)
      io.in(data.retroRoomId).emit('updatedRoomData', {
        ...parsedData.roomData,
      })
      io.in(data.retroRoomId).emit(data.retroRoomToken, {
        role: parsedData.adminToken === retroRoomToken ? 'ADMIN' : 'USER',
        roomData: parsedData.roomData,
        retroRoomUserId: retroRoomUserId,
      })
    })
    socket.on('updateNewCard', (data) => {
      const parsedData = helper.getParsedJsonData(retroRoomId)

      parsedData.roomData.templates = data.filter((d) => (d ? true : false))

      helper.writeJsonData(retroRoomId, parsedData)
      io.in(retroRoomId).emit('updatedRoomData', {
        ...parsedData.roomData,
      })
    })
    socket.on('updatePersonalInfo', (data) => {
      const parsedData = helper.getParsedJsonData(retroRoomId)

      parsedData.roomData.users = parsedData.roomData.users.map((user) => {
        if (retroRoomUserId === user.id) {
          user.name = data.name
        }
        return {
          ...user,
        }
      })

      helper.writeJsonData(retroRoomId, parsedData)
      io.in(retroRoomId).emit('updatedRoomData', {
        ...parsedData.roomData,
      })
    })
    socket.on('updateRetroDetails', (data) => {
      const parsedData = helper.getParsedJsonData(retroRoomId)

      if (parsedData.adminToken !== retroRoomToken) return

      parsedData.roomData.retroName = data.retroName
      parsedData.roomData.templates = data.templates
      parsedData.roomData.showCardAuthor = data.showCardAuthor

      helper.writeJsonData(retroRoomId, parsedData)
      io.in(retroRoomId).emit('updatedRoomData', {
        ...parsedData.roomData,
      })
    })
    socket.on('disconnect', () => {
      const parsedData = helper.getParsedJsonData(retroRoomId)

      parsedData.roomData.users = parsedData.roomData.users.map((user) => {
        if (retroRoomUserId === user.id) {
          user.isOnline = false
        }
        return {
          ...user,
        }
      })

      helper.writeJsonData(retroRoomId, parsedData)
      io.in(retroRoomId).emit('updatedRoomData', {
        ...parsedData.roomData,
      })
    })
  })
}
