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
    const { login, password } = req.body
    await UserModel.findById(req.params.id, (err, user) => {
      if (err) return res.status(500).json({ error: 'Unable to update the document', err })

      user.login = login
      user.password = password
      user.save((err, updatedUser) => {
        if (err) return res.status(500).json({ error: 'Unable to update the document', err })
        res.json(updatedUser)
      })
    })
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
    const userRes = await UserModel.findById(req.params.id)
    return res.json(userRes)
  }

  async deleteUser (req, res) {
    await UserModel.findByIdAndDelete(req.params.id)
    return res.send()
  }
}
module.exports = new UserController()
