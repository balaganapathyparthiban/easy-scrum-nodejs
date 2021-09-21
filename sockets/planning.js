const fs = require('fs')
const path = require('path')
const { v4: uuidV4 } = require('uuid')

const getParsedPlanningData = (name) => {
  let readFileData

  try {
    readFileData = fs.readFileSync(
      path.join(process.env.PWD, 'data', `${name}.json`)
    )
  } catch {
    return null
  }

  return JSON.parse(readFileData)
}

const writePlanningData = (name, parsedData) => {
  fs.writeFileSync(
    path.join(process.env.PWD, 'data', `${name}.json`),
    JSON.stringify(parsedData)
  )
}

module.exports = (io) => {
  io.on('connection', (socket) => {
    let planningRoomId
    let planningRoomToken
    let planningRoomUserId

    socket.on('joinPlanningRoom', (data) => {
      if (!data.planningRoomId || !data.planningRoomToken) {
        return
      }

      const parsedData = getParsedPlanningData(data.planningRoomId)

      if (!parsedData.tokens[data.planningRoomToken]) {
        if (!data.name) {
          socket.emit('openNameAndSpectatorModal', {})
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

        writePlanningData(data.planningRoomId, parsedData)
      } else {
        parsedData.roomData.users = parsedData.roomData.users.map((user) => {
          if (user.id === parsedData.tokens[data.planningRoomToken]) {
            user.isOnline = true
          }
          return {
            ...user,
          }
        })

        writePlanningData(data.planningRoomId, parsedData)
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
      const parsedData = getParsedPlanningData(planningRoomId)

      parsedData.roomData.users = parsedData.roomData.users.map((user) => {
        if (user.id === planningRoomUserId) {
          user.vote = data.vote
        }
        return {
          ...user,
        }
      })

      writePlanningData(planningRoomId, parsedData)
      io.in(planningRoomId).emit('updatedRoomData', {
        ...parsedData.roomData,
      })
    })
    socket.on('showVoting', (data) => {
      const parsedData = getParsedPlanningData(planningRoomId)

      parsedData.roomData.showVoting =
        parsedData.adminToken === planningRoomToken
          ? data.showVoting
          : parsedData.roomData.showVoting

      writePlanningData(planningRoomId, parsedData)
      io.in(planningRoomId).emit('updatedRoomData', {
        ...parsedData.roomData,
      })
    })
    socket.on('votingReset', (data) => {
      const parsedData = getParsedPlanningData(planningRoomId)

      parsedData.roomData.users = parsedData.roomData.users.map((user) => {
        user.vote = null
        return {
          ...user,
        }
      })
      parsedData.roomData.showVoting = false

      writePlanningData(planningRoomId, parsedData)
      io.in(planningRoomId).emit('updatedRoomData', {
        ...parsedData.roomData,
      })
    })
    socket.on('updateNameAndSpectatorStatus', (data) => {
      const parsedData = getParsedPlanningData(planningRoomId)

      parsedData.roomData.users = parsedData.roomData.users.map((user) => {
        if (planningRoomUserId === user.id) {
          user.name = data.name
          user.isSpectator = data.isSpectator
        }
        return {
          ...user,
        }
      })

      writePlanningData(planningRoomId, parsedData)
      io.in(planningRoomId).emit('updatedRoomData', {
        ...parsedData.roomData,
      })
    })
    socket.on('updatePlanningNameAndVotingSystem', (data) => {
      const parsedData = getParsedPlanningData(planningRoomId)

      if (parsedData.adminToken !== planningRoomToken) return

      parsedData.roomData.planningName = data.planningName
      parsedData.roomData.votingSystem = data.votingSystem

      writePlanningData(planningRoomId, parsedData)
      io.in(planningRoomId).emit('updatedRoomData', {
        ...parsedData.roomData,
      })
    })
    socket.on('disconnect', () => {
      const parsedData = getParsedPlanningData(planningRoomId)

      parsedData.roomData.users = parsedData.roomData.users.map((user) => {
        if (planningRoomUserId === user.id) {
          user.isOnline = false
        }
        return {
          ...user,
        }
      })

      writePlanningData(planningRoomId, parsedData)
      io.in(planningRoomId).emit('updatedRoomData', {
        ...parsedData.roomData,
      })
    })
  })
}
