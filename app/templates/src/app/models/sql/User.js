'use strict'

const bcrypt = require('bcrypt')
const sequelizePaginate = require('sequelize-paginate')
const jwt = require('jsonwebtoken')

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          notEmpty: true,
          isEmail: {
            msg: 'invalid email format'
          },
          len: {
            args: [5, 50],
            msg: 'only values with a length between 5 and 50 are allowed'
          }
        }
      },
      password: {
        type: DataTypes.VIRTUAL,
        allowNull: false,
        validate: {
          notEmpty: true,
          len: {
            args: [5, 50],
            msg: 'only values with a length between 5 and 50 are allowed'
          }
        }
      },
      password_hash: DataTypes.STRING
    },
    {
      hooks: {
        beforeCreate: async user => {
          if (user.password) {
            user.password_hash = await bcrypt.hash(user.password, 8)
            user.password = null
          }
        },
        beforeUpdate: async user => {
          if (user.password) {
            user.password_hash = await bcrypt.hash(user.password, 8)
            user.password = null
          }
        }
      },
      freezeTableName: true,
      tableName: 'USER'
    })

  User.associate = function (models) {
    // associations can be defined here
  }

  User.prototype.createToke = function ({ id }) {
    return jwt.sign({ data: id }, process.env.APP_SECRET, { expiresIn: '1h' })
  }

  User.prototype.checkPassword = function (password, password_hash) {
    return bcrypt.compare(password, password_hash)
  }
  sequelizePaginate.paginate(User)
  return User
}
