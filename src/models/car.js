'use strict'
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

require('dotenv').config()

const Cars = (sequelize, DataTypes) => {
    const carModule = sequelize.define('car', {
        name: { type: DataTypes.STRING, allowNull: false },
        carType: { type: DataTypes.STRING, allowNull: false },
        model: { type: DataTypes.STRING, allowNull: false },
        photo: { type: DataTypes.STRING, allowNull: false },
        rentCost: { type: DataTypes.STRING, allowNull: false },
        carStatus: { type: DataTypes.STRING, allowNull: false },
        status : {type : DataTypes.ENUM('avaliable','taken')},
        token: {
            type: DataTypes.VIRTUAL,
        },        
    })
    
    return carModule
}



module.exports = Cars
