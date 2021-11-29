'use strict'

const io = require("socket.io-client");
const host = "http://localhost:3000";
const driverConnection = io.connect(`${host}/drivers`);
const customConnection = io.connect(`${host}/customs`);



driverConnection.on('trip', payload =>{
    console.log(`you have req to be driver on car id : ${payload.carid} `,`\n`,`type : ${payload.carrecord.name}(${payload.carrecord.carType}) model ${payload.carrecord.model} `,`\n`,`the owner is ${payload.userinfo.username} owner phone number : ${payload.userinfo.phone}`);
})