const projectOptions = [
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
    type: 'confirm',
    name: 'login',
    message: `Would you like to use JWT validation?`
  }
]
module.exports = projectOptions
