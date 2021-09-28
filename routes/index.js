const express = require('express')
const service = require('../services')
const validation = require('../utils/validation')

const router = express.Router()

router.post(
  '/create/planning',
  [express.json(), validation.body(validation.createPlanning)],
  service.createPlanning
)

router.post(
  '/create/retro',
  [express.json(), validation.body(validation.createRetro)],
  service.createRetro
)

module.exports = router
