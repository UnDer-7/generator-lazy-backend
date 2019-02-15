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
      // Converts CamelCase to underscore_case and uppercase
      return response.projectName.replace(
        /\.?([A-Z]+)/g, (x, y) => {
          return '_' + y
        }).replace(/^_/, '').toUpperCase()
    },
    validate: function (response) {
      if (!response) return `Database name can't be blank`
      if (/\s/g.test(response)) return `The name of the database can't have blank spaces\n--> ${response}`
      return true
    }
  },
  {
    when: response => response.sqlDB !== 'sqlite',
    type: 'confirm',
    name: 'dbConfig',
    message: `Would you like to configure your database?\n (Username, Password and Host)`
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
    message: 'Would you like to run npm install?'
  },
  // TODO: ASK THE REST AND TO THE CONDITIONS
  {
    when: response => !(response.npmI && response.databaseStyle === 'slq'),
    type: 'input',
    name: 'migrate:db',
    message: `Whould you like to create your database?`
  }
]
module.exports = projectOptions
