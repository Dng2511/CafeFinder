const { DataTypes } = require('sequelize');
const sequelize = require('../../common/database');
const Cafe = require('./Cafe');

const MenuItem = sequelize.define('MenuItem', {
  item_name: { type: DataTypes.STRING, allowNull: false },
  price: { type: DataTypes.DECIMAL(10,2), allowNull: false },
  image: { type: DataTypes.TEXT }
}, {
  tableName: 'menu_items',
  timestamps: false
});

MenuItem.belongsTo(Cafe, { foreignKey: 'cafe_id' });
Cafe.hasMany(MenuItem, { foreignKey: 'cafe_id' });

module.exports = MenuItem;
