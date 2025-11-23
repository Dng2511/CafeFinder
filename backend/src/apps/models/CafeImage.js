const { DataTypes } = require('sequelize');
const sequelize = require('../../common/database');
const Cafe = require('./Cafe');

const CafeImage = sequelize.define('CafeImage', {
  image_url: { type: DataTypes.TEXT, allowNull: false }
}, {
  tableName: 'cafe_images',
  timestamps: false
});

CafeImage.belongsTo(Cafe, { foreignKey: 'cafe_id' });
Cafe.hasMany(CafeImage, { foreignKey: 'cafe_id' });

module.exports = CafeImage;
