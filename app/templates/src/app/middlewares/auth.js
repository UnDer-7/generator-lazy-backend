'use strict'

const jwt = require('jsonwebtoken')
const { promisify } = require('util')

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({ error: 'Token not found' })
  }

  const [, token] = authHeader.split(' ')
  try {
    const decoded = await promisify(jwt.verify)(token, process.env.APP_SECRET)
    // req.templateId = decoded.id --> set user's id in the requisition
    return next()
  } catch (e) {
    console.trace(e)
    res.status(400).json({ error: e })
  }
}
