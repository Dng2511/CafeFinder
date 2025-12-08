const { DataTypes } = require('sequelize');
const sequelize = require('../../common/database');
const Cafe = require('./Cafe');

const Favorite = sequelize.define('Favorite', {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  cafe_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Cafe,
      key: 'id'
    }
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'favorites',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'cafe_id']
    }
  ]
});

Favorite.belongsTo(Cafe, { foreignKey: 'cafe_id' });
Cafe.hasMany(Favorite, { foreignKey: 'cafe_id' });

module.exports = Favorite;

