'use strict'

const jwt = require('jsonwebtoken')
const { promisify } = require('util')

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({ error: 'Token not found' })
  }

  const [type, token] = authHeader.split(' ')

  if (type !== 'Bearer') {
    return res.status(401).json({ error: 'Not authorized!' })
  }

  try {
    const decoded = await promisify(jwt.verify)(token, process.env.APP_SECRET)
    req.templateId = decoded._id
    req.userData = decoded

    return next()
  } catch (e) {
    console.trace(e)
    res.status(500).json({ error: e })
  }
}
