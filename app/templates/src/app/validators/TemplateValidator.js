const Joi = require('joi')

module.exports = {
  body: {
    <%= field.fieldName %>: Joi.<%= field.fieldType.toLowerCase() %>()<%= required %>
  }
}
