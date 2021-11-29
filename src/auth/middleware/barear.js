'use strict';

const { user } = require('../../models/index')

module.exports = async (req, res, next) => {
  try {
    if (!req.headers.authorization) { next('Invalid Login')}
    const token = req.headers.authorization.split(' ').pop();  
    const validUser = await user.authToken(token);   
    req.user = validUser;
    req.token = validUser.token;
    next();
  } catch (e) {
    console.log(e)
    next('Invalid Login');
  }
}