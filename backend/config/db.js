const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.PG_URI, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: process.env.PG_SSL === 'true' ? { require: true, rejectUnauthorized: false } : false
  }
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ PostgreSQL Connected Successfully');

    // Sync all models - creates tables if they don't exist
    await sequelize.sync({ alter: true });
    console.log('✅ Database tables synced');
  } catch (error) {
    console.error('❌ PostgreSQL Connection Error:', error.message);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
