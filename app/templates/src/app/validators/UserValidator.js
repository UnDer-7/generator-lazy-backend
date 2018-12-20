const Joi = require('joi')

module.exports = {
  body: {
    login: Joi.string().required().min(5),
    password: Joi.string().required().min(5)
  }
}
