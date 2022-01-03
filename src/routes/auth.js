'use strict'
const express = require('express');
const { user } = require('../models/index');
const { car } = require('../models/index');
const router = express.Router();
const bcrypt = require('bcrypt');
const basicAuth = require('../auth/middleware/basickauth');
const barearAuth = require('../auth/middleware/barear');
const acl = require('../auth/middleware/acl');

router.post('/signUp', async (req, res) => {
    try {
        
        req.body.password = await bcrypt.hash(req.body.password, 5)
        if (req.body.role === "driver") {
           req.body = {...req.body,status : "avaliable"}
        }
        let record = await user.create(req.body);
        res.status(201).json(record);
    } catch (error) {
        throw new Error(error.message)
    }
})

router.post('/signin', basicAuth, (req, res) => {
    res.status(200).send(req.user);
})

router.get('/getallcar', barearAuth, acl('read'), async (req, res) => {
    try {
        let recordId = await car.findAll({ where: { status: 'avaliable' } })
        res.status(200).send(recordId);
    } catch (error) {
        throw new Error(error.message)
    }
})

router.get('/getmycar', barearAuth, acl('car'), async (req, res) => {
    const id = req.user.id
    let getRecords = await car.findAll({ where: { ownerId: id } });
    res.status(201).json(getRecords);
})
// router.get('/cuscar', barearAuth, acl('read'), async (req, res) => {
//     const id = req.user.id
//     let recordId = await user.findOne({ where: { id } })
//     let getRecords = await car.findAll({ where: { ownerId: recordId.name } });
//     res.status(201).json(getRecords);
// })
router.get('/getcustomercar', barearAuth, acl('read'), async (req, res) => {
    const id = req.user.id
    let recordId = await user.findOne({ where: { id } })
    let getRecords = await car.findAll({ where: { takenId: recordId.username } });
    res.status(201).json(getRecords);
})

router.put('/updateuser', barearAuth, acl('update'), async (req, res) => {    
    req.body.password=await bcrypt.hash(req.body.password, 5)
    let recordObj = req.body
    const id = req.user.id
    let recordId = await user.findOne({ where: { id } })
    console.log(recordId);
    let updateRecord = await recordId.update(recordObj);
    res.status(201).json(updateRecord);
})

router.post('/addcar', barearAuth, acl('car'), async (req, res) => {
    try {
        req.body.ownerId = req.user.id
        let record = await car.create(req.body);
        res.status(201).json(record);
    } catch (error) {
        throw new Error(error.message)
    }
})

router.delete('/deleteuser', barearAuth, acl('read'), async (req, res) => {
    const id = req.user.id
    let deletedRecord = await user.destroy({ where: { id } });
    res.status(201).json(deletedRecord);
})

router.delete('/deletecar/:id', barearAuth, acl('car'), async (req, res) => {
    let id = parseInt(req.params.id)
    let deletedRecord = await car.destroy({ where: { id } });
    res.status(201).json(deletedRecord);
})

router.put('/updatecar/:id', barearAuth, acl('car'), async (req, res) => {
    console.log(req.body);
    let recordObj = req.body
    let id = req.params.id
    let recordId = await car.findOne({ where: { id } })
    let updateRecord = await recordId.update(recordObj);
    res.status(201).json(updateRecord);
})

router.get('/getallusers',  async (req, res) => {
    try {
        let recordId = await user.findAll({ })
        res.status(200).send(recordId);
    } catch (error) {
        throw new Error(error.message)
    }
})
router.get('/getuser/:id',  async (req, res) => {
    let id = req.params.id
    try {
        let recordId = await car.findOne({ where: { id } })
        let ownerdata= await user.findOne({ where: { id: recordId.ownerId } })
        res.status(200).send(ownerdata);
    } catch (error) {
        throw new Error(error.message)
    }
})

module.exports = router