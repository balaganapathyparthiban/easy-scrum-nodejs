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
    const adminId = uuidV4()

    req.body.roomData.users.push({
      id: adminId,
      name: req.body.name,
      isSpectator: req.body.isSpectator,
    })

    fs.writeFileSync(
      path.join(process.env.PWD, 'data', `${roomId}.json`),
      JSON.stringify({
        roomId: roomId,
        adminToken: req.body.planningRoomToken,
        roomData: req.body.roomData,
        tokens: { [req.body.planningRoomToken]: adminId },
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

module.exports = service
