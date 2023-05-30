const { config } = require('dotenv');
config();

module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME_DEVELOPMENT,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
  },
  // production: {
  //   // use_env_variable: 'DATABASE_URL',
  //   // ssl: true,
  //   // dialectOptions: {
  //   //   ssl: {
  //   //     require: true,
  //   //     rejectUnauthorized: false,
  //   //   },
  //   // },
  // },
};
