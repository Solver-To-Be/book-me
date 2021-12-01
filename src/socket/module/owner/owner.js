"use strict";

const io = require("socket.io-client");
const host = "https://book-me-car.herokuapp.com";
const ownerConnection = io.connect(`${host}/owners`);
const customConnection = io.connect(`${host}/customs`);
const comName = process.argv[2];
const carid = `${process.argv[3]}`;
const faker = require('faker');

if (comName !== 'search' && carid === "undefined") {
  ownerConnection.emit("get-all", comName);
  ownerConnection.on("all", (payload) => {
    if (payload.ownerName === comName) {
      console.log(`there is a customer need a car that has id:${payload.carid} has name : ${payload.carName} from ${payload.startDate} to ${payload.endDate}`);
    }
  });
}

ownerConnection.on("rent-req", (payload) => {
  if (payload.ownerName === comName) {
    console.log(
      `there is a customer need a car that has id:${payload.carid} has name${payload.carName} from ${payload.startDate} to ${payload.endDate} `
    );
    ownerConnection.disconnect();
    customConnection.disconnect();
  }
});

if (comName === 'search') {
  console.log('searching ....');
  function location() {
    let randomLat = faker.address.latitude()
    let randomLon = faker.address.longitude()
    let obj = {
      lat: randomLat,
      lon: randomLon
    }
    return obj
  }
  ownerConnection.emit('getLocation', location())
  setInterval(function () {    
    ownerConnection.emit('getLocation', location())
  }, 10000);
}

ownerConnection.on('getLocation', (payload) => {
  console.log(`lat : ${payload.lat}`);
  console.log(`lan : ${payload.lon}`);
})

if (comName !== 'search' && process.argv[3]) {  
  console.log("response  the rent req ");
  let arg = { status: comName, carid };
  customConnection.emit("rental-res", arg);
}
