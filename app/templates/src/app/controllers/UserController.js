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

  async updateUser (req, res) {
    const userRes = await UserModel.findOneAndUpdate(req.params.id, req.body, { new: true })
    return res.json(userRes)
  }

  async getAllUser (req, res) {
    const userRes = await UserModel.paginate({}, {
      page: req.query.page || 1,
      limit: 20,
      sort: '-createdAt'
    })
    res.json({ userRes })
  }

  async getUser (req, res) {
    const userRes = await UserModel.findOneById(req.params.id)
    return res.json(userRes)
  }

  async deleteUser (req, res) {
    await UserModel.findByIdAndDelete(req.params.id)
    return res.send()
  }
}
module.exports = new UserController()
