'use strict'

const User = require('../models/User')

class SessionController {
  async login (req, res) {
    try {
      const { email, password } = req.body
      const user = await User.findOne({ email })

      if (!user) {
        return res.status(404).json({ error: 'User not found' })
      }

      if (!(await user.compareHash(password))) {
        return res.status(400).json({ error: 'Invalid Password' })
      }

      return res.status(200).json({ user, token: User.createToken(user) })
    } catch (e) {
      console.trace(e)
      res.status(500).json({ error: e })
    }
  }
}

module.exports = new SessionController()
