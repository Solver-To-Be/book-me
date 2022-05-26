'use strict';

const { user } = require('../../models/index')

module.exports = async (req, res, next) => {
  try {
    if (!req.headers.authorization) { _authError() }
    const token = req.headers.authorization.split(' ').pop();  
    const validUser = await user.authToken(token);   
    req.user = validUser;
    req.token = validUser.token;
    next();
  } catch (e) {
    next('Invalid Login');
  }
}