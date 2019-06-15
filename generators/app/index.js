'use strict'
const Generator = require('yeoman-generator/lib')
const projectQuestions = require('./generator/prompt/project');

module.exports = class extends Generator {
  constructor (args, opts) {
    super(args, opts)
  }

  async start () {
    this.log('            .-""-._\n' +
      '           / ___/  \\         _&_\n' +
      '     _.--""|/    `\\|        // \\\\\n' +
      '   .\'      ( ^/ ^  )\'.     / / \\ \\\n' +
      '  /         | _   |   \\   // / \\ \\\\\n' +
      '  |        _\\____/    |  /_/_/_\\_\\_\\\n' +
      '  |      .\' \\____/-._ |     .-"-.\n' +
      '  |     /            `;    /#    \\\n' +
      '  |    /  /     _|_.---\\   |     |\n' +
      '  |.-.;   :--.-(_/.____/.-""\\___/"-.\n' +
      '  /    \\ / ~~/   /\\   \\{"=.______.="}\n' +
      ' /--. ; /___/_~~/ ; .--\\"=...__...="}\n' +
      '/    \\-/  `\\______|/    \\-.______..-;\n' +
      '|    /`|   |       \\    |   ||||   ||\n' +
      '|   /_ |   |_______/    |   ||||   ||\n' +
      '|   \\_/|   |-------\'    |--\'||\'--._||\n' +
      '|      |   |            |   ||     |>\n' +
      '|______|   |____________|._ || _..-;|\n' +
      '|      [___]            |  `||()   ||\n' +
      '|______ |\\/|____________|   ||     ()\n' +
      ' (__)   \\__/        (__)    ()\n' +
      '\n')
    this.log(('--------------LAZY-BACKEND--------------\n\n'))

    await this.prompt(projectQuestions)
  }
}

