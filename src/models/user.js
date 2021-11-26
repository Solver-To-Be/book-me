'use strict'
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')


require('dotenv').config()

const Users = (sequelize, DataTypes) => {
    const userModule = sequelize.define('user', {
        username: { type: DataTypes.STRING, allowNull: false },
        password: { type: DataTypes.STRING, allowNull: false },
        token: {
            type: DataTypes.VIRTUAL
        }

    })
    // userModule.authBasic = async function (username, password) {
    //     try {
    //         const user = await user.findOne({ where: { username } })
    //         console.log(user, '======================================');

    //         const valid = await bcrypt.compare(password, user.password)
    //         console.log(valid, '======================================');

    //     } catch (error) {
    //         console.error(error.message)
    //     }

    // }
    return userModule
}



module.exports = Users