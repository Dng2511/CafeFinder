const { DataTypes } = require('sequelize');
const sequelize = require('../../common/database');

const EditRequest = sequelize.define('EditRequest', {
  cafe_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'cafes',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  data: {
    type: DataTypes.JSON,
    allowNull: false,
    comment: 'JSON object containing fields to be updated: name, address, phone_number, open_time, close_time, menu_items, cafe_images, etc.'
  },
  image_url: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'URL of the main image uploaded with this request'
  },
  status: {
    type: DataTypes.ENUM('PENDING', 'APPROVED', 'REJECTED'),
    allowNull: false,
    defaultValue: 'PENDING'
  },
  rejection_reason: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Reason for rejection if status is REJECTED'
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    onUpdate: DataTypes.NOW
  }
}, {
  tableName: 'edit_requests',
  timestamps: false
});

module.exports = EditRequest;

