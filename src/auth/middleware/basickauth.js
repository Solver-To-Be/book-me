'use strict'
const base64 = require('base-64')
const { user } = require('../../models/index')

module.exports = async (req, res, next) => {
    const encodedHeaders = req.headers.authorization.split(' ')[1]
    const [username, password] = base64.decode(encodedHeaders).split(':');    
    const response = await user.authBasic(username, password)
    req.user = response
    next()
}

