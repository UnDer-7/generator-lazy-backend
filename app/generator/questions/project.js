const projectOptions = [
  {
    type: 'input',
    name: 'projectName',
    message: `What's the project's name?`,
    validate: function (response) {
      if (/\s/g.test(response)) return `The name of the project can't have blank spaces\n--> ${response}`
      return true
    }
  },
  {
    type: 'list',
    name: 'projectStyle',
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
    when: function (response) {
      return response.projectStyle === 'sql'
    },
    type: 'list',
    name: 'sqlDB',
    message: 'What SQL database would you like to use?',
    choices: [
      {
        name: 'Postgres',
        value: 'pg'
      },
      {
        name: 'MySQL',
        value: 'mySQL'
      },
      {
        name: 'MariaDB',
        value: 'mariaDB'
      },
      {
        name: 'SQLite',
        value: 'sqlLite'
      },
      {
        name: 'Microsoft SQL Server',
        value: 'sqlServer'
      }
    ]
  },
  {
    type: 'input',
    name: 'databaseName',
    message: `What's the database's name?`,
    default: function (response) {
      return response.projectName.toUpperCase()
    },
    validate: function (response) {
      if (/\s/g.test(response)) return `The name of the database can't have blank spaces\n--> ${response}`
      return true
    }
  },
  {
    type: 'confirm',
    name: 'login',
    message: `Would you like to use JWT validation?`
  }
]
module.exports = projectOptions
