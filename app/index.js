'use strict'
const Generator = require('yeoman-generator')
const bcrypt = require('bcrypt')
const path = require('path')
const util = require('util')
const cmd = util.promisify(require('child_process').exec)

const project = require('./generator/questions/project')
const msg = require('./generator/messages')

module.exports = class extends Generator {
  constructor (args, opts) {
    super(args, opts)

    const lazyBackend = msg.titleDash('---------') + msg.initialText('LAZY-BACKEND') + msg.titleDash('---------')
    const restAPI = msg.titleDash('-----------') + msg.initialText('REST-API') + msg.titleDash('-----------')
    this.log(msg.titleDash('\n------------------------------'))
    this.log(lazyBackend)
    this.log(restAPI)
    this.log(msg.titleDash('------------------------------\n'))
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
      const { stdout } = await this._private_create_git_repo()
      console.log('stdout ', msg.greenText(stdout) + msg.dash('------------------------------\n'))
    } catch (e) {
      console.log(msg.error(e))
      throw msg.error(e)
    }

    if (this.answers.createDB) {
      try {
        const { stdout } = await this._private_verify_sequelize_cli()
        console.log('stdout ', msg.greenText(stdout) + msg.dash('------------------------------\n'))
      } catch (e) {
        console.log(msg.warning(`\nIt's seems you don't have sequelize-cli installed!`))

        let cliAnswer = await this.prompt([
          {
            type: 'confirm',
            name: 'sequelizeCli',
            message: `Would you like to install ${msg.underline('sequelize-cli')}?`
          }
        ])

        if (cliAnswer.sequelizeCli) {
          try {
            const { stdout } = await this._private_install_sequelize_cli()
            console.log('stdout ', msg.greenText(stdout))
          } catch (e) {
            console.log(msg.error(e))
            throw msg.error(e)
          }
        }
      }

      try {
        const { stdout } = await this._private_create_database()
        console.log('stdout ', msg.greenText(stdout) + msg.dash('------------------------------\n'))
      } catch (e) {
        console.error(msg.error(e))
        throw msg.error(e)
      }

      if (this.answers.createTable) {
        try {
          const { stdout } = await this._private_create_table()
          console.log('stdout ', msg.greenText(stdout) + msg.dash('------------------------------\n'))
        } catch (e) {
          console.error(msg.error(e))
          throw e
        }
      }
    }

    console.log(msg.endingMessage(`\nIf you like lazy-backend project give it a star at GitHub`))
    console.log(msg.urlGitHub(`https://github.com/UnDer-7/generator-lazy-backend`))
    console.log(msg.author('\nAuthor: Mateus Gomes da Silva Cardoso'))
  }

  /**
   * Creates all files inside the src folder
   * ## files-created
   *  - server.js
   *  - routes.js
   *  - index.js
   *  - consoleColors.js
   *  @private
   */
  _private_src () {
    this.destinationRoot(path.resolve(this.answers.projectName, 'src'))
    this.fs.copyTpl(
      this.templatePath('./src/server.ejs'),
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

    this.fs.copyTpl(
      this.templatePath('./src/consoleColors.js'),
      this.destinationPath('consoleColors.js')
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
      this.templatePath('./env.ejs'),
      this.destinationPath('.env'),
      {
        answer: this.answers,
        appSecret: this._private_generate_random_number()
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
        project: this.answers.projectName.toLowerCase(),
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
      this.templatePath('./src/config/databaseConfig.ejs'),
      this.destinationPath('databaseConfig.js')
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
    this.log(msg.dash('\n------------------------------'))
    this.log(`CREATING GIT REPOSITORY`)
    this.log(msg.dash('------------------------------'))
    return this._private_execute_command('git init')
  }

  /**
   * Check if the user has sequelize_cli installed
   * @return {Promise} - Returns the child_process.exec()
   * @private
   */
  _private_verify_sequelize_cli () {
    this.log(msg.dash('\n------------------------------'))
    this.log('CHECKING IF SEQUELIZE-CLI IS INSTALLED')
    this.log(msg.dash('------------------------------'))
    return this._private_execute_command(' npx sequelize --version')
  }

  /**
   * Install sequelize-cli globally
   * @return {Promise} - Returns the child_process.exec()
   * @private
   */
  _private_install_sequelize_cli () {
    return this._private_execute_command('npm i -g sequelize-cli')
  }

  /**
   * Creates the Database
   * @return {Promise} - Returns the child_process.exec()
   * @private
   */
  _private_create_database () {
    this.log(msg.dash('\n------------------------------'))
    this.log('CREATING DATABASE!')
    this.log(msg.dash('------------------------------'))

    return this._private_execute_command('npx sequelize db:create')
  }

  /**
   * Creates the user's table if the JWT validation
   * was marked
   * @return {Promise} - Returns the child_process.exec()
   * @private
   */
  _private_create_table () {
    this.log(msg.dash('\n------------------------------'))
    this.log('CREATING USER\'S TABLE!')
    this.log(msg.dash('------------------------------'))

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
    console.log(`Running ${msg.greenText(command)} command`)
    return cmd(command, { cwd: this.rootPath })
  }

  /**
   * Generates a random string
   * string containing only numbers, other wise a string with numbers and letters.
   * @return The generated string
   * @private
   */
  _private_generate_random_number () {
    let text = ''
    const letters = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz`
    const numbers = `0123456789`
    const specialCharacters = `!@#$%*()_+¹²³£¢¬{[]}§´"'^~ç,.;/<>:?─·ª°`

    const possibilities = letters + numbers + specialCharacters
    for (let i = 0; i < 50; i++) text += possibilities.charAt(Math.floor(Math.random() * possibilities.length))

    const appSecret = bcrypt.hashSync(text, 10)
    return appSecret
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
