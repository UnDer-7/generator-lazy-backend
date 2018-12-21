const Joi = require('joi')

module.exports = {
  body: {<% for(let i=0; i< field.length; i++) { %>
    <%= field[i].fieldName %>: Joi.<%= field[i].fieldType.toLowerCase() %>()<%= required %>,<% } %>
  }
}
