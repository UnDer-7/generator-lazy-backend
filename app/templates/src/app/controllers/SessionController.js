const UserModel = require('../models/UserModel')

class SessionController {
  async generateToken (req, res) {
    const { login, password } = req.body

    const userRes = await UserModel.findOne({ login })

    if (!userRes) {
      return res.status(400).json({ error: 'User not found' })
    }
    if (!(await userRes.compareHash(password))) {
      return res.status(400).json({ error: 'Invalid Password' })
    }

    return res.json({ userRes, token: UserModel.createToken(userRes) })
  }
}
module.exports = new SessionController()
