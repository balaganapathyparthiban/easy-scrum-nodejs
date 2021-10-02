const { v4: uuidV4 } = require('uuid')
const helper = require('../utils/helper')

module.exports = (io) => {
  io.on('connection', (socket) => {
    let planningRoomId
    let planningRoomToken
    let planningRoomUserId

    socket.on('joinRoom', (data) => {
      if (!data.planningRoomId || !data.planningRoomToken) {
        return
      }

      const parsedData = helper.getParsedJsonData(data.planningRoomId)

      if (!parsedData.tokens[data.planningRoomToken]) {
        if (!data.name) {
          socket.emit('openPersonalDetailsModal', {})
          return
        }

        const userId = uuidV4()
        const userToken = data.planningRoomToken

        parsedData.roomData.users.push({
          id: userId,
          name: data.name,
          isSpectator: data.isSpectator,
          isOnline: true,
          vote: null,
        })
        parsedData.tokens[userToken] = userId

        helper.writeJsonData(data.planningRoomId, parsedData)
      } else {
        parsedData.roomData.users = parsedData.roomData.users.map((user) => {
          if (user.id === parsedData.tokens[data.planningRoomToken]) {
            user.isOnline = true
          }
          return {
            ...user,
          }
        })

        helper.writeJsonData(data.planningRoomId, parsedData)
      }

      planningRoomId = data.planningRoomId
      planningRoomToken = data.planningRoomToken
      planningRoomUserId = parsedData.tokens[data.planningRoomToken]

      socket.join(data.planningRoomId)
      io.in(data.planningRoomId).emit('updatedRoomData', {
        ...parsedData.roomData,
      })
      io.in(data.planningRoomId).emit(data.planningRoomToken, {
        role: parsedData.adminToken === planningRoomToken ? 'ADMIN' : 'USER',
        roomData: parsedData.roomData,
        planningRoomUserId: planningRoomUserId,
      })
    })
    socket.on('updatePlanningVote', (data) => {
      const parsedData = helper.getParsedJsonData(planningRoomId)

      parsedData.roomData.users = parsedData.roomData.users.map((user) => {
        if (user.id === planningRoomUserId) {
          user.vote = data.vote
        }
        return {
          ...user,
        }
      })

      helper.writeJsonData(planningRoomId, parsedData)
      io.in(planningRoomId).emit('updatedRoomData', {
        ...parsedData.roomData,
      })
    })
    socket.on('showVoting', (data) => {
      const parsedData = helper.getParsedJsonData(planningRoomId)

      parsedData.roomData.showVoting =
        parsedData.adminToken === planningRoomToken
          ? data.showVoting
          : parsedData.roomData.showVoting

      helper.writeJsonData(planningRoomId, parsedData)
      io.in(planningRoomId).emit('updatedRoomData', {
        ...parsedData.roomData,
      })
    })
    socket.on('votingReset', (data) => {
      const parsedData = helper.getParsedJsonData(planningRoomId)

      parsedData.roomData.users = parsedData.roomData.users.map((user) => {
        user.vote = null
        return {
          ...user,
        }
      })
      parsedData.roomData.showVoting = false

      helper.writeJsonData(planningRoomId, parsedData)
      io.in(planningRoomId).emit('updatedRoomData', {
        ...parsedData.roomData,
      })
    })
    socket.on('updatePersonalInfo', (data) => {
      const parsedData = helper.getParsedJsonData(planningRoomId)

      parsedData.roomData.users = parsedData.roomData.users.map((user) => {
        if (planningRoomUserId === user.id) {
          user.name = data.name
          user.isSpectator = data.isSpectator
        }
        return {
          ...user,
        }
      })

      helper.writeJsonData(planningRoomId, parsedData)
      io.in(planningRoomId).emit('updatedRoomData', {
        ...parsedData.roomData,
      })
    })
    socket.on('updatePlanningDetails', (data) => {
      const parsedData = helper.getParsedJsonData(planningRoomId)

      if (parsedData.adminToken !== planningRoomToken) return

      parsedData.roomData.planningName = data.planningName
      parsedData.roomData.votingSystem = data.votingSystem

      helper.writeJsonData(planningRoomId, parsedData)
      io.in(planningRoomId).emit('updatedRoomData', {
        ...parsedData.roomData,
      })
    })
    socket.on('disconnect', () => {
      const parsedData = helper.getParsedJsonData(planningRoomId)

      parsedData.roomData.users = parsedData.roomData.users.map((user) => {
        if (planningRoomUserId === user.id) {
          user.isOnline = false
        }
        return {
          ...user,
        }
      })

      helper.writeJsonData(planningRoomId, parsedData)
      io.in(planningRoomId).emit('updatedRoomData', {
        ...parsedData.roomData,
      })
    })
  })
}
