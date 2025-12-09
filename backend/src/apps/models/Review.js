const { DataTypes } = require('sequelize');
const sequelize = require('../../common/database');
const Cafe = require('./Cafe');
const User = require('./User');

const Review = sequelize.define('Review', {
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
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0,
      max: 5
    }
  },
  comment: {
    type: DataTypes.TEXT,
    validate: {
      len: [0, 500]
    }
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'reviews',
  timestamps: false
});

Cafe.hasMany(Review, { foreignKey: 'cafe_id', as: 'reviews' });
Review.belongsTo(Cafe, { foreignKey: 'cafe_id', as: 'cafe' });

User.hasMany(Review, { foreignKey: 'user_id', as: 'reviews' });
Review.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

module.exports = Review;
