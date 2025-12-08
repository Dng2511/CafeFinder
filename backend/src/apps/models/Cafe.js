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
  rating: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  rating_count: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  has_wifi: { type: DataTypes.BOOLEAN, defaultValue: false },
  has_parking: { type: DataTypes.BOOLEAN, defaultValue: false },
  has_air_conditioning: { type: DataTypes.BOOLEAN, defaultValue: false },
  has_power_outlet: { type: DataTypes.BOOLEAN, defaultValue: false },
  is_quiet: { type: DataTypes.BOOLEAN, defaultValue: false },
  no_smoking: { type: DataTypes.BOOLEAN, defaultValue: false },
  lat: { type: DataTypes.FLOAT },
  lon: { type: DataTypes.FLOAT }
}, {
  tableName: 'cafes',
  timestamps: false
});

module.exports = Cafe;
