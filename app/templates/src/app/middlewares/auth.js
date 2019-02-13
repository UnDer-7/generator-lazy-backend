'use strict'

const jwt = require('jsonwebtoken')
const authConfig = require('../../config/authConfig')
const { promisify } = require('util')

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({ error: 'Token not found' })
  }

  const [, token] = authHeader.split(' ')
  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret)
    req.templateId = decoded.id
  } catch (e) {
    res.status(400).json({ error: e })
  }

  return next()
}
