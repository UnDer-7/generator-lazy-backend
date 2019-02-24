'use strict'

const express = require('express')
const handle = require('express-async-handler')
const validate = require('express-validation')
const routes = express.Router()

const controllers = require('./app/controllers')
const validators = require('./app/validators')
<%if (login) { %>
const authMiddleware = require('./app/middlewares/auth')
<% } %>
const rootUrl = '/api'
<%if (login) { %>
routes.post(`${rootUrl}/login`, validate(validators.UserValidator), handle(controllers.SessionController.login))
routes.post(`${rootUrl}/user`, validate(validators.UserValidator), handle(controllers.UserController.createUser))

routes.use(authMiddleware)

/**
 *  USER'S ROUTES
 */
routes.put(`${rootUrl}/user/:id`, validate(validators.UserValidator), handle(controllers.UserController.updateUser))
routes.get(`${rootUrl}/user`, handle(controllers.UserController.getAllUser))
routes.get(`${rootUrl}/user/:id`, handle(controllers.UserController.getUser))
routes.delete(`${rootUrl}/user/:id`, handle(controllers.UserController.deleteUser))
<% } %>

// Do not remove this cometary
// ===== lazy-backend hook =====

module.exports = routes
