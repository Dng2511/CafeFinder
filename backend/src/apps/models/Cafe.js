//kết nối với database
const { DataTypes } = require('sequelize');
const sequelize = require('../../common/database');

const Cafe = sequelize.define('Cafe', {
  name: { type: DataTypes.STRING, allowNull: false },
  address: { type: DataTypes.TEXT, allowNull: false },
  phone_number: { type: DataTypes.STRING },
  open_time: { type: DataTypes.TIME },
  close_time: { type: DataTypes.TIME },
  main_image: { type: DataTypes.TEXT },
  has_wifi: { type: DataTypes.BOOLEAN, defaultValue: false },
  has_parking: { type: DataTypes.BOOLEAN, defaultValue: false },
  has_air_conditioning: { type: DataTypes.BOOLEAN, defaultValue: false }
}, {
  tableName: 'cafes',
  timestamps: false
});

module.exports = Cafe;
