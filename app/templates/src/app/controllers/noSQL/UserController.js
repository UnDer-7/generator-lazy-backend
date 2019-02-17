'use strict'

const User = require('../models/User')

class UserController {
  async createUser (req, res) {
    const { email } = req.body

    if (await User.findOne({ email })) return res.status(400).json({ error: 'User already exists' })

    const user = await User.create(req.body)
    return res.status('201').json(user)
  }

  async updateUser (req, res) {
    const { email, password } = req.body
    await User.findById(req.params.id, (err, user) => {
      if (err) return res.status(500).json({ error: 'Unable to update the document', err })

      user.email = email
      user.password = password
      user.save((err, updatedUser) => {
        if (err) return res.status(500).json({ error: 'Unable to update the document', err })
        res.json(updatedUser)
      })
    })
  }

  async getAllUser (req, res) {
    const user = await User.paginate({}, {
      page: req.query.page || 1,
      limit: 20,
      sort: '-createdAt'
    })
    res.json({ user })
  }

  async getUser (req, res) {
    const user = await User.findById(req.params.id)
    return res.json(user)
  }

  async deleteUser (req, res) {
    await User.findByIdAndDelete(req.params.id)
    return res.send()
  }
}
module.exports = new UserController()
