'use strict'

const server = require('./server')
const color = require('./consoleColors')

const port = process.env.PORT || 3000

const dash = '-------------------------------------------'

server.listen(port,
  () => console.log(color.FgMagenta, `\n${dash}\n| Server running on http://localhost:${port} |\n${dash}\n`))
