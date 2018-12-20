const mongoose = require('mongoose')

const <%= entity %>Schema = new mongoose.Schema({
  <%= field.fieldName %>: {
    type: <%= field.fieldType %>,
    required: <%= field.required %>
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
})
module.exports = mongoose.model('<%= entity %>', <%= entity %>Schema)
