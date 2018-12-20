'use strict'
const Generator = require('yeoman-generator')
const path = require('path')

const fieldOptions = require('./prompt')

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
        name: 'entityName',
        message: `What's the entity's name?`
      }
    ])

    this.addField = await this.prompt([
      {
        type: 'confirm',
        name: 'addField',
        message: `Do you want to add a field to your entity?`
      }
    ])
    
    if (this.addField.addField) {
      this.fields = await this.prompt(fieldOptions)
    }
  }

  start() {
    this._private_src()
    this._private_settings()
    this._private_entity()
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

    this.fs.copyTpl(
      this.templatePath('./.env'),
      this.destinationPath('.env')
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
      this.destinationPath('package.json')
    )

    this.fs.copyTpl(
      this.templatePath('./package-lock.json'),
      this.destinationPath('package-lock.json')
    )
  }

  _private_entity() {
    this.destinationRoot(path.resolve('src', 'app', 'controllers'))
    this.fs.copyTpl(
      this.templatePath('./src/app/controllers/TemplateController.js'),
      this.destinationPath(`${this.answers.entityName}Controller.js`),
      {
        entity: this.answers.entityName
      }
    )

    this.destinationRoot(path.resolve('..', 'models'))
    this.fs.copyTpl(
      this.templatePath('./src/app/models/TemplateModel.js'),
      this.destinationPath(`${this.answers.entityName}Model.js`),
      {
        field: this.fields,
        entity: this.answers.entityName
      }
    )
  }
};
