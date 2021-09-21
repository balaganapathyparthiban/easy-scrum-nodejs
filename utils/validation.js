const Validator = require('fastest-validator')
const constants = require('./constants')
const v = new Validator()

const validation = {}

validation.body = (schema) => {
  return (req, res, next) => {
    const checkValidation = v.compile(schema)(req.body)
    if (checkValidation && checkValidation.length > 0) {
      return res.json({ status: 0, error: checkValidation })
    }
    next()
  }
}

validation.createPlanning = {
  roomData: {
    type: 'object',
    strict: true,
    props: {
      planningName: { type: 'string' },
      votingSystem: {
        type: 'array',
        items: {
          type: 'object',
          optional: true,
          props: {
            name: { type: 'string' },
          },
        },
      },
      users: {
        type: 'array',
        items: {
          type: 'object',
          optional: true,
          props: {
            id: { type: 'string' },
            name: { type: 'string' },
            isSpectator: { type: 'boolean', convert: true },
          },
        },
      },
      currentStory: { type: 'string' },
      showVoting: { type: 'boolean', convert: true },
    },
  },
}

module.exports = validation
