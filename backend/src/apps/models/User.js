const {DataTypes} = require('sequelize');
const sequelize = require('../../common/database');

const User = sequelize.define('User', {
  username: { type: DataTypes.STRING, allowNull: false, unique: true },
  email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
  password_hash: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM('customer', 'admin'), allowNull: false, defaultValue: 'customer' }
}, {
  tableName: 'users',
  timestamps: false
});

module.exports = User;