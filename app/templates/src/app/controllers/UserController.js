const UserModel = require('../models/UserModel')

class UserController {
  async createUser (req, res) {
    const { login } = req.body

    if (await UserModel.findOne({ login })) {
      return res.status(400).json({ error: 'User already exists' })
    }

    const userRes = await UserModel.create(req.body)
    return res.json(userRes)
  }

  async getAllUsers (req, res) {
    const userRes = await UserModel.find()
    return res.json(userRes)
  }
}
module.exports = new UserController()
