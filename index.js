'use strict'

const { db } = require('./src/models/index')
const { start } = require('./src/server')

db.sync().then(() => {
    start();
})