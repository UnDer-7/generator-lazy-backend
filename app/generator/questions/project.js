const { snakeCase } = require('lodash')
const chalk = require('chalk')

const dash = chalk.green
const warning = chalk.keyword('orange')
const questionMark = chalk.green

const projectOptions = [
  {
    type: 'input',
    name: 'projectName',
    message: `What's the project's name?`,
    validate: function (response) {
      if (!response) return `Project name can't be blank`
      if (/\s/g.test(response)) return `The name of the project can't have blank spaces\n--> ${response}`
      return true
    }
  },
  {
    type: 'list',
    name: 'databaseStyle',
    message: 'What kind of database would you like to use?',
    choices: [
      {
        name: 'NoSQL - MongoDB',
        value: 'mongo'
      },
      {
        name: 'SQL - PostgreSQL, MySQL, etc',
        value: 'sql'
      }
    ]
  },
  {
    when: response => response.databaseStyle === 'sql',
    type: 'list',
    name: 'sqlDB',
    message: 'What SQL database would you like to use?',
    choices: [
      {
        name: 'Postgres',
        value: 'postgres'
      },
      {
        name: 'MySQL',
        value: 'mysql'
      },
      {
        name: 'MariaDB',
        value: 'mariadb'
      },
      {
        name: 'SQLite',
        value: 'sqlite'
      },
      {
        name: 'Microsoft SQL Server',
        value: 'mssql'
      }
    ]
  },
  {
    type: 'input',
    name: 'databaseName',
    message: `What's the database's name?`,
    default: function (response) {
      return snakeCase(response.projectName).toUpperCase()
    },
    validate: function (response) {
      if (!response) return `Database name can't be blank`
      if (/\s/g.test(response)) return `The name of the database can't have blank spaces\n--> ${response}`
      return true
    }
  },
  {
    when: response => response.sqlDB !== 'sqlite' && response.databaseStyle !== 'mongo',
    type: 'confirm',
    name: 'dbConfig',
    message: `Would you like to configure your database? `,
    suffix: `${warning('(Username, Password and Host)')}\n`
  },
  {
    when: response => response.dbConfig && response.sqlDB !== 'sqlite',
    type: 'input',
    name: 'username',
    message: `What's your username?`
  },
  {
    when: response => response.dbConfig && response.sqlDB !== 'sqlite',
    type: 'input',
    name: 'password',
    message: `What's your password?`,
    default: response => response.username
  },
  {
    when: response => response.dbConfig && response.sqlDB !== 'sqlite',
    type: 'input',
    name: 'host',
    message: `What port your database is using?`,
    default: response => {
      switch (response.sqlDB) {
        case 'postgres':
          return 5432
        case 'mysql':
          return 3306
        case 'mariadb':
          return 3306
        case 'mssql':
          return 1433
      }
    }
  },
  {
    type: 'confirm',
    name: 'login',
    message: `Would you like to use JWT validation?`
  },
  {
    type: 'confirm',
    name: 'npmI',
    message: 'Would you like to run npm install?',
    color: 'red'
  },
  {
    when: response => {
      return (response.npmI && response.databaseStyle !== 'mongo')
    },
    type: 'confirm',
    name: 'createDB',
    message: `Would you like to create your database?`,
    prefix: warning(`\n${dash('------------------------------')}\nFOR ALL THE NEXT QUESTIONS YOUR DATABASE MUST BE RUNNING!!\n${dash('------------------------------')}\n\n${questionMark('?')}`)
  },
  {
    when: response => response.createDB && response.login,
    type: 'confirm',
    name: 'createTable',
    message: `Would you like to create the User's table?`,
    suffix: `\n${warning(' It\'s recommend when using JWT validation')}\n`
  }
]
module.exports = projectOptions
