const mongoose = require('mongoose')
const paginate = require('mongoose-paginate')

const <%= entity %>Schema = new mongoose.Schema({ <% for(let i=0; i< field.length; i++) { %>
  <%= field[i].fieldName %>: {
    type: <%= field[i].fieldType %>,
    required: <%= field[i].required %>
  },<% } %>
  createdAt: {
    type: Date,
    default: Date.now()
  }
})

<%= entity %>Schema.plugin(paginate)

module.exports = mongoose.model('<%= entity %>', <%= entity %>Schema)
