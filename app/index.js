'use strict'
const Generator = require('yeoman-generator')
const path = require('path')
const chalk = require('chalk')
const util = require('util')
const cmd = util.promisify(require('child_process').exec)
const _ = require('lodash')
const project = require('./generator/questions/project')

const dash = chalk.green
const initalText = chalk.red
const greenText = chalk.greenBright
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
  }

  /**
   * - Yeoman Hook
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
  }

  /**
   * - Yeoman Hook
   * This method is the last method to be executed.
   * It creates git local repository and
   * Database stuff if SQL is used.
   */
  async end () {
    try {
      const { stdout, stderr } = await this._private_create_git_repo()
      console.log('stdout ', greenText(stdout))
      console.log('stderr ', stderr)
    } catch (e) {
      console.log(error(e))
      throw error(e)
    }

    if (this.answers.createDB) {
      try {
        const { stdout, stderr } = await this._private_create_database()
        console.log('stdout ', greenText(stdout))
        console.log('stderr ', stderr)
        this.log(greenText('\n------------------------------'))
        this.log('DATABASE CREATED!')
        this.log(greenText('------------------------------\n'))
      } catch (e) {
        console.error(error(e))
        throw error(e)
      }
    }

    if (this.answers.createDB && this.answers.createTable) {
      try {
        const { stdout, stderr } = await this._private_create_table()
        console.log('stdout ', greenText(stdout))
        console.log('stderr ', stderr)
        this.log(greenText('\n------------------------------'))
        this.log('TABLE CREATED!')
        this.log(greenText('------------------------------\n'))
      } catch (e) {
        console.error(error(e))
        throw e
      }
    }
  }

  /**
   * Creates all files inside the src folder
   * ## files-created
   *  - server.js
   *  - routes.js
   *  - index.js
   *  @private
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
   *  @private
   */
  _private_settings () {
    this.rootPath = this.destinationRoot(path.resolve('..'))
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
   *  @private
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
   *  @private
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

  /**
   * Creates a new Git local repository
   * @return {Promise} - Returns the child_process.exec()
   * @private
   */
  _private_create_git_repo () {
    return this._private_execute_command('git init')
  }

  /**
   * Creates the Database
   * @return {Promise} - Returns the child_process.exec()
   * @private
   */
  _private_create_database () {
    this.log(greenText('\n------------------------------'))
    this.log('CREATING DATABASE!')
    this.log(greenText('------------------------------\n'))

    return this._private_execute_command('npx sequelize db:create')
  }

  /**
   * Creates the user's table if the JWT validation
   * was marked
   * @return {Promise} - Returns the child_process.exec()
   * @private
   */
  _private_create_table () {
    this.log(greenText('\n------------------------------'))
    this.log('CREATING USER\'S TABLE!')
    this.log(greenText('------------------------------\n'))

    return this._private_execute_command('npx sequelize db:migrate')
  }

  /**
   * Run a command on the user's console.
   * It'll execute the command inside the user's project folder
   * @param command {String}
   * @return
   * @private
   */
  _private_execute_command (command) {
    console.log(`Running ${greenText(command)} command`)
    return cmd(command, { cwd: this.rootPath })
  }

  /**
   * Generates a random string
   * @param {Number}size - (default value: 25). Set size of the generated string.
   * @param {Boolean}letters - (default value: true). If false will generated a
   * string containing only numbers, other wise a string with numbers and letters.
   * @return The generated string
   * @private
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
   * @return {String} - ex: 2132019212724
   * @private
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
