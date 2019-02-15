'use strict'
const Generator = require('yeoman-generator')
const path = require('path')
const chalk = require('chalk')
const cmd = require('child_process')

const shellHelper = require('./generator/shellHelper/shellHelper')
const project = require('./generator/questions/project')

const dash = chalk.green.bgBlack
const initalText = chalk.red.bgBlack
const sequelizeCMD = chalk.greenBright
const error = chalk.red

module.exports = class extends Generator {
  constructor (args, opts) {
    super(args, opts)

    const lazyBackend = dash('---------') + initalText('LAZY-BACKEND') + dash('---------')
    const restAPI = dash('-----------') + initalText('REST-API') + dash('-----------')
    this.log(dash('\n------------------------------'))
    this.log(lazyBackend)
    this.log(restAPI)
    this.log(dash('------------------------------'))
    this.log(('\nInitializing the lazy-backend\n'))
  }

  /**
   * Ask all the questions to the user
   */
  async prompting () {
    this.answers = await this.prompt(project)

    // this.npm = await this.prompt(after)
  }

  /**
   * Call all method to generate the project
   */
  start () {
    this._private_src()
    this._private_settings()
    this._private_entity()

    if (this.answers.databaseStyle === 'sql') this._private_sequelize_config()

    if (this.answers.npmI) {
      this.npmInstall()
    }

    // this._private_sequelize_commands()
  }

  end () {
    this._private_sequelize_commands()
  }

  /**
   * Creates all files inside the src folder
   * ## files-created
   *  - server.js
   *  - routes.js
   *  - index.js
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
   * ## files-created
   *  - editorconfig
   *  - env
   *  - eslintrc
   *  - gitignore
   *  - package
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
        appSecret: this._private_generate_random_number(),
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
   * Creates all files inside the app folder.
   * If JWT option was selected it will create the user entity.
   * ## files-created
   *  - index.js
   *  - UserController.js (if JWT option was selected)
   *  - SessionController.js (if JWT option was selected)
   *  - auth.js (if JWT option was selected)
   *  - User.js (if JWT option was selected)
   *  - UserValidator (if JWT option was selected)
   */
  _private_entity () {
    this.destinationRoot(path.resolve('src', 'app', 'controllers'))
    this.fs.copyTpl(
      this.templatePath('./src/app/controllers/index.js'),
      this.destinationPath('index.js')
    )

    this.destinationRoot(path.resolve('..', 'models'))
    this.fs.copyTpl(
      this.templatePath(this.answers.databaseStyle === 'mongo'
        ? './src/app/models/noSQL/index.js' : './src/app/models/sql/index.js'),
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
        this.templatePath(this.answers.databaseStyle === 'mongo'
          ? './src/app/controllers/noSQL/UserController.js' : './src/app/controllers/sql/UserController.js'),
        this.destinationPath('UserController.js')
      )

      this.fs.copyTpl(
        this.templatePath(this.answers.databaseStyle === 'mongo'
          ? './src/app/controllers/noSQL/SessionController.js' : './src/app/controllers/sql/SessionController.js'),
        this.destinationPath('SessionController.js')
      )

      this.destinationRoot(path.resolve('..', 'middlewares'))
      this.fs.copyTpl(
        this.templatePath('./src/app/middlewares/auth.js'),
        this.destinationPath('auth.js')
      )

      this.destinationRoot(path.resolve('..', 'models'))
      this.fs.copyTpl(
        this.templatePath(this.answers.databaseStyle === 'mongo'
          ? './src/app/models/noSQL/User.js' : './src/app/models/sql/User.js'),
        this.destinationPath('User.js')
      )

      this.destinationRoot(path.resolve('..', 'validators'))
      this.fs.copyTpl(
        this.templatePath('./src/app/validators/UserValidator.js'),
        this.destinationPath('UserValidator.js')
      )
    }
  }

  /**
   * Creates all files inside the database folder, only if the database is SQL.
   * If JWT option was selected it will create the user's migrations.
   * ## files-created
   *  - databaseConfig.js
   *  - sequelizerc
   *  - 20190207222756-create-user.js (if JWT option was selected)
   */
  _private_sequelize_config () {
    this.destinationRoot(path.resolve('..', '..', 'config'))
    this.fs.copyTpl(
      this.templatePath('./src/config/databaseConfig.js'),
      this.destinationPath('databaseConfig.js'),
      {
        dbName: this.answers.databaseName,
        username: this.answers.username,
        password: this.answers.password,
        db: this.answers.sqlDB,
        port: this.answers.host
      }
    )

    this.destinationRoot(path.resolve('..', 'database'))

    this.destinationRoot(path.resolve('migrations'))
    if (this.answers.login) {
      this.fs.copyTpl(
        this.templatePath('./src/database/migrations/20190207222756-create-user.js'),
        this.destinationPath(this._private_generate_date_time() + '-create-user.js')
      )
    }
    this.destinationRoot(path.resolve('..', 'seeders'))

    this.destinationRoot(path.resolve('..', '..', '..'))
    this.fs.copyTpl(
      this.templatePath('./sequelizerc'),
      this.destinationPath('.sequelizerc')
    )
  }

  _private_sequelize_commands () {
    this.log(sequelizeCMD('\n------------------------------'))
    this.log(sequelizeCMD('CREATING DATABASE!'))
    this.log(sequelizeCMD('------------------------------\n'))
    cmd.exec('npx sequelize db:create', { cwd: this.destinationRoot('./') }, (e, stdout, stderr, cwd) => {
      if (e instanceof Error) {
        console.error(error(e))
        throw e
      }
      console.log('stdout ', stdout)
      console.log('stderr ', stderr)
      this.log(sequelizeCMD('\n------------------------------'))
      this.log(sequelizeCMD('DATABASE CREATED!'))
      this.log(sequelizeCMD('------------------------------\n'))
    })
    // shellHelper.exec('npx sequelize db:create', `${this.answers.projectName}/`, err => console.error(err))
  }

  /**
   * Generates a random string
   * @param {Number}size - (default value: 25). Set size of the generated string.
   * @param letters - boolean (default value: true). If false will generated a
   * string containing only numbers, other wise a string with numbers and letters.
   * @return The generated string
   */
  _private_generate_random_number (size = 25, letters = true) {
    let text = ''
    const possible = letters ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789' : '0123456789'

    for (let i = 0; i < size; i++) text += possible.charAt(Math.floor(Math.random() * possible.length))
    return text
  }

  /**
   * Generates a string containing the date and hour.
   * format: month, date, year, hours, minutes and seconds
   * @return - string - ex: 2132019212724
   */
  _private_generate_date_time () {
    let currentdate = new Date()
    return '' + (currentdate.getMonth() + 1) +
      currentdate.getDate() +
      currentdate.getFullYear() +
      currentdate.getHours() +
      currentdate.getMinutes() +
      currentdate.getSeconds()
  }
}
