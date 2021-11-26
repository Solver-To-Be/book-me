'use strict'
const express = require('express');
const  {user}  = require('../models/index')
console.log(user ,'from auth rout =====================================');
const router = express.Router();
const bcrypt = require('bcrypt')
// const basicAuth = require('../auth/middleware/basickauth')
router.get('/test', (req, res) => {
    res.status(200).send('Done');
})

router.post('/signUp', async (req, res) => {
    req.body.password = await bcrypt.hash(req.body.password, 5)
    console.log(user);
    let record = await user.create(req.body);
    res.status(201).json(record);
})

// router.post('/signin', basicAuth, (req, res) => {
// console.log('from sign in ==============================');
//     res.status(200).send(req.body);
// })

// router.get('/signin', bearerAuth, (req,res)=>{
//     
//     res.status(200).send('Done');
// })




module.exports = router