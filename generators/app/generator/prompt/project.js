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
    name: 'dbConfig',
    message: `Would you like to use TypeScript?`,
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
  }
];

module.exports = projectOptions;
