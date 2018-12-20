const express = require('express')
const handle = require('express-async-handler')
const validate = require('express-validation')
const routes = express.Router()

const controllers = require('./app/controllers')
const validators = require('./app/validators')

const authMiddleware = require('./app/middlewares/auth')

const rootUrl = '/api'

routes.post(`${rootUrl}/user`, validate(validators.UserValidator), handle(controllers.UserController.createUser))
routes.post(`${rootUrl}/login`, validate(validators.UserValidator), handle(controllers.SessionController.generateToken))

routes.use(authMiddleware)

routes.get(`${rootUrl}/user`, handle(controllers.UserController.getAllUsers))

/**
 * Entity
 */
routes.post(`${rootUrl}/<%= entity.toLowerCase() %>`, validate(validators.<%= entity %>Validator), handle(controllers.<%= entity %>Controller.create<%= entity %>))
routes.get(`${rootUrl}/<%= entity.toLowerCase() %>`, handle(controllers.<%= entity %>Controller.getAll<%= entity %>))

module.exports = routes
