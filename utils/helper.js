const fs = require('fs')
const path = require('path')

const helper = {}

helper.getParsedJsonData = (name) => {
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

helper.writeJsonData = (name, parsedData) => {
  fs.writeFileSync(
    path.join(process.env.PWD, 'data', `${name}.json`),
    JSON.stringify(parsedData)
  )
}

module.exports = helper
