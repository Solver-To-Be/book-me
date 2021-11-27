'use strict'
const user = require('./user')
const cars = require('./car')
// console.log(user,'from index =====================================');
const { Sequelize, DataTypes } = require('sequelize');

const DATABASE_URL = process.env.NODE_ENV === 'test' ? 'sqlite:memory:' : process.env.DATABASE_URL;

let sequelizeOptions = process.env.NODE_ENV === 'production' ? {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    }
  }
} : {};

const sequelize = new Sequelize(DATABASE_URL, sequelizeOptions)

module.exports = {
  user : user(sequelize, DataTypes),
  car : cars(sequelize, DataTypes),
  db : sequelize 
}