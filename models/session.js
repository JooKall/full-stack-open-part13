const { Model , DataTypes } = require('sequelize')

const { sequelize } = require('../utils/db')

class Session extends Model {}

Session.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    unique: true,
    allowNull: false,
    references: { model: 'users', key: 'id' },
  },
  token: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'session',
})

module.exports = Session