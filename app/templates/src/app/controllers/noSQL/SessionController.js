'use strict'

const User = require('../models/User')

class SessionController {
  async login (req, res) {
    const { email, password } = req.body

    const user = await User.findOne({ login })

    if (!user) return res.status('404').json({ error: 'User not found' })
    if (!(await user.compareHash(password))) return res.status(400).json({ error: 'Invalid Password' })

    return res.status('200').json({ user, token: User.createToken(user) })
  }
}
module.exports = new SessionController()
