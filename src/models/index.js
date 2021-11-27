'use strict'
const users = require('./user')
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

const user = users(sequelize, DataTypes)
const car = cars(sequelize, DataTypes)

user.hasMany(car, { foreignKey: "ownerId", sourceKey: "id" });

car.belongsTo(user, { foreignKey: "ownerId", targetKey: "id" });


module.exports = {
  user ,
  car ,
  db : sequelize 
}