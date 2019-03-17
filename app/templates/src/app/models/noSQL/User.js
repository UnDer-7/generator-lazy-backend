'use strict'

const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const paginate = require('mongoose-paginate')

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: [5, 'Minimum 5 characters']
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: [5, 'Minimum 5 characters']
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
})

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next()
  }

  this.password = await bcrypt.hash(this.password, 8)
})

UserSchema.methods = {
  compareHash (password) {
    return bcrypt.compare(password, this.password)
  }
}

UserSchema.statics = {
  createToken (userRes) {
    const user = Object.assign({}, {
      _id: userRes._id,
      email: userRes.email,
      createdAt: userRes.createdAt
    })

    return jwt.sign(user, process.env.APP_SECRET, {
      expiresIn: '1h', algorithm: 'HS512'
    })
  }
}

UserSchema.plugin(paginate)
module.exports = mongoose.model('User', UserSchema)
