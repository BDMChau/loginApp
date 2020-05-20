const sequelize = require('sequelize');
const db = require('../database/database');

const user = db.define('user', /*Schema*/{
    id: {
        type: sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    googleid: {
        type: sequelize.STRING
    },
    name: {
        type: sequelize.STRING
    },
    email: {
        type: sequelize.STRING
    },
    password: {
        type: sequelize.STRING
    }
});

db.sync();

// user.destroy({
//     where: {},
//     truncate: true,
//     cascade: false,
//     restartIdentity: true
// })


module.exports = user;