const CronJob = require('cron').CronJob
const fs = require('fs')
const path = require('path')

const clearDataJob = new CronJob(
  '59 23 * * *',
  () => {
    try {
      if (fs.existsSync(path.join(process.env.PWD, 'data'))) {
        const files = fs.readdirSync(path.join(process.env.PWD, 'data'))

        if (files && files.length > 0) {
          files.forEach((file) => {
            fs.unlinkSync(path.join(process.env.PWD, 'data', file))
          })
        }
      }
    } catch {}
  },
  null,
  'UTC'
)

module.exports = { clearDataJob }
