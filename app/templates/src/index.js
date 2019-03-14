'use strict'

const server = require('./server')
const color = require('./consoleColors')

const port = process.env.PORT || 3000

const dash = '----------------------'

server.listen(port,
  () => {
    console.log(color.FgMagenta, `\n${dash}\nServer running on`) + console.log(color.FgYellow, `http://localhost:${port}`) + console.log(color.FgMagenta,`${dash}\n`)
  })
