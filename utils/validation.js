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
  stories: {
    type: 'array',
    items: {
      type: 'object',
      optional: true,
      props: {
        name: { type: 'string' },
        totalVotes: { type: 'string' },
        majorityVotes: { type: 'string' },
        votes: {
          type: 'array',
          items: {
            type: 'object',
            optional: true,
            props: {
              userId: { type: 'string' },
              vote: { type: 'string' },
            },
          },
        },
        status: {
          type: 'string',
          enum: [constants.NOT_STARTED, constants.COMPLETED],
        },
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
  whoShowCards: {
    type: 'string',
    enum: [constants.ONLY_ME, constants.EVERYONE],
  },
  currentStory: { type: 'string' },
  startVoting: { type: 'boolean', convert: true },
  showVoting: { type: 'boolean', convert: true },
}

module.exports = validation
