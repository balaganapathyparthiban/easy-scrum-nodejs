const fs = require('fs')
const path = require('path')
const { v4: uuidV4 } = require('uuid')

const service = {}

service.createPlanning = (req, res) => {
  try {
    if (!fs.existsSync(path.join(process.env.PWD, 'data'))) {
      fs.mkdirSync(path.join(process.env.PWD, 'data'))
    }

    const roomId = uuidV4()

    fs.writeFileSync(
      path.join(process.env.PWD, 'data', `${roomId}.json`),
      JSON.stringify({
        roomId: roomId,
        adminToken: req.body.planningRoomToken,
        roomData: req.body.roomData,
        tokens: {},
      })
    )
    return res.json({
      status: 1,
      data: {
        planningRoomId: roomId,
        planningRoomToken: req.body.planningRoomToken,
      },
    })
  } catch (error) {
    return res.json({
      status: 0,
      data: null,
      message: 'Something went wrong',
    })
  }
}

service.createRetro = (req, res) => {
  try {
    if (!fs.existsSync(path.join(process.env.PWD, 'data'))) {
      fs.mkdirSync(path.join(process.env.PWD, 'data'))
    }

    const roomId = uuidV4()

    fs.writeFileSync(
      path.join(process.env.PWD, 'data', `${roomId}.json`),
      JSON.stringify({
        roomId: roomId,
        adminToken: req.body.retoRoomToken,
        roomData: req.body.roomData,
        tokens: {},
      })
    )
    return res.json({
      status: 1,
      data: {
        retroRoomId: roomId,
        retroRoomToken: req.body.retroRoomToken,
      },
    })
  } catch (error) {
    return res.json({
      status: 0,
      data: null,
      message: 'Something went wrong',
    })
  }
}

module.exports = service
