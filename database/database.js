require('dotenv').config();
const sequelize = require('sequelize');

const db = new sequelize({
  database: 'authlogin',
  username: 'postgres',
  password: process.env.PASSWORD_POSTGRES,
  host: 'localhost',
  port: 5432,
  dialect: 'postgres',
  dialectOptions: {
    ssl: false
  },
  define: {
    freezeTableName: true
  }
})


db.authenticate()
  .then(() => console.log('CONNECTED DATABASE'))
  .catch((err) => console.log(err))


module.exports = db

