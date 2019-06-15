const { snakeCase, endsWith } = require('lodash')

const validation = (response) => {
  if (!response) return `Field can't be blank`
  if (/\s/g.test(response)) return `Field can't have blank spaces\n--> ${response}`
  if (!/^[a-z0-9-_]+$/i.test(response)) return `Invalid character\n-->${response}`
  if (/^[0-9].+$/.test(response)) return `Can't start with number\n-->${response}`
  if (!/^[A-Z]/.test(response)) return `The first character needs to be a capital letter\n-->${response}`
  if (endsWith(response, '_')) return `Can't end the name with _\n-->${response}`
  if (endsWith(response, '-')) return `Can't end the name with -\n-->${response}`
  return true
}

const projectOptions = [
  {
    type: 'input',
    name: 'projectName',
    message: `What's the project's name?`,
    validate: validation
  },
  {
    type: 'confirm',
    name: 'ts',
    message: `Would you like to use TypeScript?`,
  },
  {
    type: 'list',
    name: 'databaseStyle',
    message: 'What kind of database would you like to use?',
    choices: [
      {
        name: 'SQL',
        value: 'sql',
      },
      {
        name: 'NoSQL',
        value: 'mongo',
      },
    ],
  },
  {
    when: response => (response.ts && response.databaseStyle === 'sql'),
    type: 'list',
    name: 'orm',
    message: 'What kind of ORM you would you like to use?',
    choices: [
      {
        name: 'TypeORM',
        value: 'typeORM',
      },
      {
        name: 'Sequelize',
        value: 'sequelize',
      },
    ],
  },
  {
    when: response => (response.ts && response.databaseStyle === 'mongo'),
    type: 'list',
    name: 'odm',
    message: 'What kind of ODM you would you like to use?',
    choices: [
      {
        name: 'Mongoose',
        value: 'mongoose',
      },
      {
        name: 'TypeORM',
        value: 'typeORM',
      },
    ],
  },
  {
    when: response => response.databaseStyle === 'sql',
    type: 'list',
    name: 'sqlDB',
    message: 'What SQL database would you like to use?',
    choices: [
      {
        name: 'Postgres',
        value: 'postgres',
      },
      {
        name: 'MySQL',
        value: 'mysql',
      },
      {
        name: 'MariaDB',
        value: 'mariadb',
      },
      {
        name: 'SQLite',
        value: 'sqlite',
      },
      {
        name: 'Microsoft SQL Server',
        value: 'mssql',
      },
    ],
  },
  {
    type: 'input',
    name: 'databaseName',
    message: `What's the database's name?`,
    default: function (response) {
      return snakeCase(response.projectName).toUpperCase()
    },
    validate: validation,
  },
  {
    when: response => response.sqlDB !== 'sqlite' && response.databaseStyle !== 'mongo',
    type: 'confirm',
    name: 'dbConfig',
    message: `Would you like to configure your database access?`,
    suffix: ` (Username, Password and Port)`
  },
  {
    when: response => response.dbConfig && response.sqlDB !== 'sqlite',
    type: 'input',
    name: 'username',
    message: `What's your database username?`
  },
  {
    when: response => response.dbConfig && response.sqlDB !== 'sqlite',
    type: 'input',
    name: 'password',
    message: `What's your database password?`,
    default: response => response.username
  },
  {
    when: response => response.dbConfig && response.sqlDB !== 'sqlite',
    type: 'input',
    name: 'dbPort',
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
    message: `Would you like to use simple JWT validation?`,
    suffix: ` (Username and Password validation)`,
  },
  {
    type: 'confirm',
    name: 'npmI',
    message: 'Would you like to run npm install?',
    color: 'red'
  },
  {
    when: response => {
      return response.npmI && response.databaseStyle !== 'mongo' && response.dbConfig
    },
    type: 'confirm',
    name: 'createDB',
    message: `Would you like to create your database?`,
    prefix: '\n------------------------------\n FOR ALL THE NEXT QUESTIONS YOUR DATABASE MUST BE RUNNING!!\n------------------------------\n\n?'
  },
  {
    when: response => {
      return response.createDB && response.login && response.dbConfig
    },
    type: 'confirm',
    name: 'createTable',
    message: `Would you like to create the User's table?`,
    suffix: `\n (It will be used to store Username and Password)\n`
  }
];

module.exports = projectOptions;
