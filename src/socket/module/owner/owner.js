"use strict";
// const driverFunction=require('./handler/vendorHandler');
const io = require("socket.io-client");
const host = "http://localhost:3000";
const ownerConnection = io.connect(`${host}/owners`);
const customConnection = io.connect(`${host}/customs`);
const comName = process.argv[2];
const carid = `${process.argv[3]}`;
if (comName && carid === "undefined") {
  
  ownerConnection.emit("get-all", comName);
  ownerConnection.on("all", (payload) => {
    console.log(payload);
  });
}
ownerConnection.on("rent-req", (payload) => {
  console.log(
    `there is a customer need a car that has id:${payload.carid} has name${payload.carName} from ${payload.startDate} to ${payload.endDate} `
  );

  ownerConnection.disconnect();
  customConnection.disconnect();
});
if (comName && process.argv[3]) {
  console.log("response  the rent req ");
  let arg = { status: comName, carid };
  customConnection.emit("rental-res", arg);
}
