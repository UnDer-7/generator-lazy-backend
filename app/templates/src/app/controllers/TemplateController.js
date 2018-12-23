const <%= entity %>Model = require('../models/<%= entity %>Model')

class <%= entity %>Controller {
  async create<%= entity %> (req, res) {
    const <%= entity.toLowerCase() %>Res = await <%= entity %>Model.create(req.body)
    return res.json(<%= entity.toLowerCase() %>Res)
  }

  async update<%= entity %> (req, res) {
    const <%= entity.toLowerCase() %>Res = await <%= entity %>Model.findOneAndUpdate(req.params.id, req.body, { new: true })
    return res.json(<%= entity.toLowerCase() %>Res)
  }

  async getAll<%= entity %> (req, res) {
    const <%= entity.toLowerCase() %>Res = await <%= entity %>Model.paginate({}, {
      page: req.query.page || 1,
      limit: 20,
      sort: '-createdAt'
    })
    res.json({ <%= entity.toLowerCase() %>Res })
  }

  async get<%= entity %> (req, res) {
    const <%= entity.toLowerCase() %>Res = await <%= entity %>Model.findById(req.params.id)
    return res.json(<%= entity.toLowerCase() %>Res)
  }

  async delete<%= entity %> (req, res) {
    await <%= entity %>Model.findByIdAndDelete(req.params.id)
    return res.send()
  }
}

module.exports = new <%= entity %>Controller()
