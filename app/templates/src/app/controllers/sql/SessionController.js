'use strict'

const { User } = require('../models')

class SessionController {
  async login (req, res) {
    const { email, password } = req.body

    const user = await User.findOne({ where: { email: email } })

    if (!user) {
      return res.status(400).json({ error: 'User not found' })
    }

    if (!await user.checkPassword(password, user.password_hash)) {
      return res.status(400).json({ error: 'Invalid Password' })
    }

    const token = user.createToke(user)
    return res.status(200).json({ token: token, user: user })
  }
}

module.exports = new SessionController()
