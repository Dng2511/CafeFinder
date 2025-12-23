const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    dialectOptions: {
      useUTC: false,
    },
    logging: false,
  }
);

sequelize.authenticate()
  .then(() => console.log("Connected to PostgreSQL"))
  .catch(err => console.error("Database connection error:", err));

module.exports = sequelize;
