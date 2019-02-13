'use strict'
const Generator = require('yeoman-generator')
const path = require('path')
const chalk = require('chalk')

const project = require('./generator/questions/project')

module.exports = class extends Generator {
  constructor (args, opts) {
    super(args, opts)
    this.log(chalk.red.bgBlack('\n------------------------------'))
    this.log(chalk.red.bgBlack('---------LAZY-BACKEND---------'))
    this.log(chalk.red.bgBlack('-----------REST-API-----------'))
    this.log(('\nInitializing the lazy-backend\n'))
  }

  /**
   * Ask all the questions to the user
   */
  async prompting () {
    this.answers = await this.prompt(project)

    this.npm = await this.prompt([
      {
        type: 'confirm',
        name: 'npmI',
        message: 'Would you like to run npm install?'
      }
    ])
  }

  /**
   * Call all method to generate the project
   */
  start () {
    this._private_src()
    this._private_settings()
    this._private_entity()
    this._private_config()

    if (this.npm.npmI) {
      this.npmInstall()
    }
  }

  /**
   * Creates all files inside the src folder
   * files-created
   *  server.js
   *  routes.js
   *  index.js
   */
  _private_src () {
    this.destinationRoot(path.resolve(this.answers.projectName, 'src'))
    this.fs.copyTpl(
      this.templatePath('./src/server.js'),
      this.destinationPath('server.js'),
      {
        db: this.answers.databaseStyle
      }
    )

    this.fs.copyTpl(
      this.templatePath('./src/routes.js'),
      this.destinationPath('routes.js'),
      {
        login: this.answers.login
      }
    )

    this.fs.copyTpl(
      this.templatePath('./src/index.js'),
      this.destinationPath('index.js')
    )
  }

  /**
   * Creates all settings files
   * files-created
   *  editorconfig
   *  env
   *  eslintrc
   *  gitignore
   *  package
   */
  _private_settings () {
    this.destinationRoot(path.resolve('..'))
    this.fs.copyTpl(
      this.templatePath('./editorconfig'),
      this.destinationPath('.editorconfig')
    )

    this.fs.copyTpl(
      this.templatePath('./env'),
      this.destinationPath('.env'),
      {
        dbName: this.answers.databaseName,
        appSecret: this._private_token_secret(),
        login: this.answers.login,
        db: this.answers.databaseStyle
      }
    )

    this.fs.copyTpl(
      this.templatePath('./eslintrc.json'),
      this.destinationPath('.eslintrc.json')
    )

    this.fs.copyTpl(
      this.templatePath('./gitignore'),
      this.destinationPath('.gitignore')
    )

    this.fs.copyTpl(
      this.templatePath('./package.json'),
      this.destinationPath('package.json'),
      {
        project: this.answers.projectName,
        login: this.answers.login,
        db: this.answers.databaseStyle
      }
    )

    // this.fs.copyTpl(
    //   this.templatePath('./package-lock.json'),
    //   this.destinationPath('package-lock.json'),
    //   {
    //     project: this.answers.projectName
    //   }
    // )
  }

  /**
   * Generate the token secret
   */
  _private_token_secret () {
    let text = ''
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    for (let i = 0; i < 25; i++) text += possible.charAt(Math.floor(Math.random() * possible.length))
    console.log('token', text)
  }

  _private_entity () {
    this.destinationRoot(path.resolve('src', 'app', 'controllers'))
    this.fs.copyTpl(
      this.templatePath('./src/app/controllers/index.js'),
      this.destinationPath('index.js')
    )

    this.destinationRoot(path.resolve('..', 'models'))
    this.fs.copyTpl(
      this.templatePath('./src/app/models/index.js'),
      this.destinationPath('index.js')
    )

    this.destinationRoot(path.resolve('..', 'validators'))
    this.fs.copyTpl(
      this.templatePath('./src/app/validators/index.js'),
      this.destinationPath('index.js')
    )

    if (this.answers.login) {
      this.destinationRoot(path.resolve('..', 'controllers'))
      this.fs.copyTpl(
        this.templatePath('./src/app/controllers/UserController.js'),
        this.destinationPath('UserController.js')
      )

      this.fs.copyTpl(
        this.templatePath('./src/app/controllers/SessionController.js'),
        this.destinationPath('SessionController.js')
      )

      this.destinationRoot(path.resolve('..', 'middlewares'))
      this.fs.copyTpl(
        this.templatePath('./src/app/middlewares/auth.js'),
        this.destinationPath('auth.js')
      )

      this.destinationRoot(path.resolve('..', 'models'))
      this.fs.copyTpl(
        this.templatePath('./src/app/models/UserModel.js'),
        this.destinationPath('UserModel.js')
      )

      this.destinationRoot(path.resolve('..', 'validators'))
      this.fs.copyTpl(
        this.templatePath('./src/app/validators/UserValidator.js'),
        this.destinationPath('UserValidator.js')
      )
    }
  }

  _private_config () {
    this.destinationRoot(path.resolve('..', '..', 'config'))
    this.fs.copyTpl(
      this.templatePath('./config/databaseConfig.js'),
      this.destinationPath('databaseConfig.js')
    )

    if (this.answers.login) {
      this.fs.copyTpl(
        this.templatePath('./config/authConfig.js'),
        this.destinationPath('authConfig.js')
      )
    }
  }
}
