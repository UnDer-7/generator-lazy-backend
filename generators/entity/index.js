'use strict'
const Generator = require('yeoman-generator/lib')

module.exports = class extends Generator {
  constructor (args, opts) {
    super(args, opts)
  }

  start() {
    this.log(('--------------LAZY-ENTITY----------------'))
  }
}
