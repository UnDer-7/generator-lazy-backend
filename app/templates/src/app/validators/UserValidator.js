'use strict'

const Joi = require('joi')

module.exports = {
  body: {
    email: Joi.string().required().min(5).max(55).email(),
    password: Joi.string().required().min(5).max(55).alphanum()
  }
}
