const Joi = require('joi')

module.exports = {
  body: {<% for(let i=0; i< field.length; i++) { %>
    <%if (field[i].required) { %><%= field[i].fieldName %>: Joi.<%= field[i].fieldType.toLowerCase() %>().required(),<% }else{ %><%=
    field[i].fieldName %>: Joi.<%= field[i].fieldType.toLowerCase() %>(),<% } %><% } %>
  }
}
