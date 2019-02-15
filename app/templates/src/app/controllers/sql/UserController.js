'use strict'

const { User } = require('../models')

class UserController {
  async createUser (req, res) {
    try {
      const verify = await User.findOne({ where: { email: req.body.email } })
      if (!verify) return res.status('400').json({ error: 'User already exists' })
      const user = await User.create(req.body)
      return res.status('201').json(user)
    } catch (e) {
      return res.status('400').json({ error: e })
    }
  }

  async updateUser (req, res) {
    try {
      const [numberOfAffectedRows, [updatedUser]] = await User.update(req.body,
        {
          returning: true,
          individualHooks: true,
          where: { id: req.params.id }
        })
      res.status(updatedUser ? '201' : '404').json(updatedUser)
    } catch (e) {
      res.status('400').json({ error: e })
    }
  }

  async getAllUser (req, res) {
    const { page = 1, paginate = 25 } = req.query

    const options = {
      page: page,
      paginate: paginate
    }

    try {
      const { docs, pages, total } = await User.paginate(options)
      return res.status('200').json({ docs, pages: pages, total: total })
    } catch (e) {
      return res.status('400').json({ error: e })
    }
  }

  async getUser (req, res) {
    try {
      const user = await User.findByPk(req.params.id)
      return res.status(user ? '200' : '404').json(user)
    } catch (e) {
      return res.status('400').json({ error: e })
    }
  }

  async deleteUser (req, res) {
    try {
      const user = await User.destroy({
        where: { id: req.params.id },
        limit: 1
      })
      return res.status(user ? '200' : '400').json({ rowsDeleted: user })
    } catch (e) {
      return res.status('400').json({ error: e })
    }
  }
}

module.exports = new UserController()
