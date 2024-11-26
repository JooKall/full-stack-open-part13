const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('sessions', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
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
    })
    await queryInterface.addColumn('users', 'disabled', {
      type: DataTypes.BOOLEAN,
      default: false,
    })
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('sessions')
    await queryInterface.removeColumn('users', 'disabled')
  },
}
