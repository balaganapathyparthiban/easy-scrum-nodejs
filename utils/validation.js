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
  planningRoomToken: { type: 'string' },
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

validation.createRetro = {
  retroRoomToken: { type: 'string' },
  roomData: {
    type: 'object',
    strict: true,
    props: {
      retroName: { type: 'string' },
      users: {
        type: 'array',
        items: {
          type: 'object',
          optional: true,
          props: {
            id: { type: 'string' },
            name: { type: 'string' },
          },
        },
      },
      templates: {
        type: 'array',
        items: {
          type: 'object',
          optional: true,
          props: {
            name: { type: 'string' },
            color: { type: 'string' },
            list: {
              type: 'array',
              items: {
                type: 'object',
                optional: true,
                props: {},
              },
            },
          },
        },
      },
      showCardAuthor: { type: 'boolean', convert: true },
    },
  },
}

module.exports = validation
