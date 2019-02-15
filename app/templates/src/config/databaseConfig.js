'use strict'

module.exports = {
  development: {
    username: '<%= username  %>',
    password: '<%= password  %>',
    database: '<%= dbName  %>',
    host: 'localhost',
    dialect: '<%= db  %>',
    port: '<%= port  %>',
    operatorsAliases: false
  },
  test: {
    username: '',
    password: '',
    database: '',
    host: '',
    dialect: '',
    operatorsAliases: false
  },
  production: {
    username: '',
    password: '',
    database: '',
    host: '',
    dialect: '',
    operatorsAliases: false
  }
}
