'use strict'
const Generator = require('yeoman-generator')
const path = require('path')

const fieldOptions = require('./generator/questions/entitys')

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
    this.log('Initializing the lazy-generator');
  }

  async prompting() {
    this.answers = await this.prompt([
      {
        type: 'input',
        name: 'projectName',
        message: `What's the project's name?`
      },
      {
        type: 'input',
        name: 'databaseName',
        message: `What's the database's name?`
      },
      {
        type: 'input',
        name: 'entityName',
        message: `What's the entity's name?`
      }
    ])

    this.fields = []
    do {
      this.addField = await this.prompt([
        {
          type: 'confirm',
          name: 'addField',
          message: `Do you want to add a field to your entity?`
        }
      ])
      if (this.addField.addField) {
        this.fields.push(await this.prompt(fieldOptions))
      }
    } while (this.addField.addField)

    this.npm = await this.prompt([
      {
        type: 'confirm',
        name: 'npmI',
        message: 'Would you like to run npm install?'
      }
    ])
  }

  start() {
    this._private_src()
    this._private_settings()
    this._private_entity()
    this._private_config()

    if (this.npm.npmI) {
      this.npmInstall()
    }
  }

  _private_src() {
    this.destinationRoot(path.resolve(this.answers.projectName, 'src'))
    this.fs.copyTpl(
      this.templatePath('./src/server.js'),
      this.destinationPath('server.js')
    )

    this.fs.copyTpl(
      this.templatePath('./src/routes.js'),
      this.destinationPath('routes.js'),
      {
        entity: this.answers.entityName
      }
    )

    this.fs.copyTpl(
      this.templatePath('./src/index.js'),
      this.destinationPath('index.js')
    )
  }

  _private_settings() {
    this.destinationRoot(path.resolve('..'))
    this.fs.copyTpl(
      this.templatePath('./.editorconfig'),
      this.destinationPath('.editorconfig')
    )

    const randomNuber = Math.floor(Math.random() * 10000000);

    this.fs.copyTpl(
      this.templatePath('./.env'),
      this.destinationPath('.env'),
      {
        db: this.answers.databaseName,
        appSecret: randomNuber
      }
    )

    this.fs.copyTpl(
      this.templatePath('./.eslintrc.js'),
      this.destinationPath('.eslintrc.js')
    )

    this.fs.copyTpl(
      this.templatePath('./.gitignore'),
      this.destinationPath('.gitignore')
    )

    this.fs.copyTpl(
      this.templatePath('./package.json'),
      this.destinationPath('package.json'),
      {
        project: this.answers.projectName
      }
    )

    this.fs.copyTpl(
      this.templatePath('./package-lock.json'),
      this.destinationPath('package-lock.json'),
      {
        project: this.answers.projectName
      }
    )
  }

  _private_entity() {
    this.destinationRoot(path.resolve('src', 'app', 'controllers'))
    this.fs.copyTpl(
      this.templatePath('./src/app/controllers/index.js'),
      this.destinationPath('index.js')
    )

    this.fs.copyTpl(
      this.templatePath('./src/app/controllers/UserController.js'),
      this.destinationPath('UserController.js')
    )

    this.fs.copyTpl(
      this.templatePath('./src/app/controllers/SessionController.js'),
      this.destinationPath('SessionController.js')
    )

    this.fs.copyTpl(
      this.templatePath('./src/app/controllers/TemplateController.js'),
      this.destinationPath(`${this.answers.entityName}Controller.js`),
      {
        entity: this.answers.entityName,
        field: this.fields
      }
    )

    this.destinationRoot(path.resolve('..', 'middlewares'))
    this.fs.copyTpl(
      this.templatePath('./src/app/middlewares/auth.js'),
      this.destinationPath('auth.js')
    )

    this.destinationRoot(path.resolve('..', 'models'))
    this.fs.copyTpl(
      this.templatePath('./src/app/models/index.js'),
      this.destinationPath('index.js')
    )

    this.fs.copyTpl(
      this.templatePath('./src/app/models/UserModel.js'),
      this.destinationPath('UserModel.js')
    )

    this.fs.copyTpl(
      this.templatePath('./src/app/models/TemplateModel.js'),
      this.destinationPath(`${this.answers.entityName}Model.js`),
      {
        field: this.fields,
        entity: this.answers.entityName
      }
    )

    this.destinationRoot(path.resolve('..', 'validators'))
    this.fs.copyTpl(
      this.templatePath('./src/app/validators/index.js'),
      this.destinationPath('index.js')
    )

    this.fs.copyTpl(
      this.templatePath('./src/app/validators/UserValidator.js'),
      this.destinationPath('UserValidator.js')
    )

    this.fs.copyTpl(
      this.templatePath('./src/app/validators/TemplateValidator.js'),
      this.destinationPath(`${this.answers.entityName}Validator.js`),
      {
        field: this.fields,
        entity: this.answers.entityName
      }
    )
  }

  _private_config() {
    this.destinationRoot(path.resolve('..', '..', 'config'))
    this.fs.copyTpl(
      this.templatePath('./config/databaseConfig.js'),
      this.destinationPath('databaseConfig.js')
    )

    this.fs.copyTpl(
      this.templatePath('./config/authConfig.js'),
      this.destinationPath('authConfig.js')
    )
  }
};
