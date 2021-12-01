'use strict'

const io = require("socket.io-client");
const host = "https://book-me-car.herokuapp.com";
const driverConnection = io.connect(`${host}/drivers`);
const driverName = `${process.argv[2]}`;

if (driverName !== "undefined") {
    driverConnection.on('trip', payload => {

        if (driverName === payload.driver) {
            console.log(`you have req to be driver on car id : ${payload.carid} `, `\n`, `type : ${payload.carrecord.name}(${payload.carrecord.carType}) model ${payload.carrecord.model} `, `\n`, `the owner is ${payload.userinfo.username} owner phone number : ${payload.userinfo.phone}`);
        }

    })
} else {
    console.log('pleas enter your name');
    driverConnection.disconnect();
}