const <%= entity %>Model = require('../models/<%= entity %>Model')

class <%= entity %>Controller {
  async create<%= entity %> (req, res) {
    const { name } = req.body

    if (await <%= entity %>Model.findOne({ name })) {
      return res.status(400).json({ error: '<%= entity %> already exists' })
    }

    const <%= entity %>Res = await <%= entity %>Model.create(req.body)
    return res.json(<%= entity %>Res)
  }

  getAll<%= entity %>(req, res) {
    res.json({ Tst: 'Get All URL working' })
  }
}

module.exports = new <%= entity %>Controller()
