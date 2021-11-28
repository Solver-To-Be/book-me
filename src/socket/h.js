"use strict";
require("dotenv").config();
const server = http.createServer(app);
const { Server } = require("socket.io");
const caps = new Server(server);

const owners = caps.of("/owners");
const drivers = caps.of("/drivers");
const customs = caps.of("/customs");
const { user } = require("../models/index");
const { car } = require("../models/index");
const msgQueue = {
  companies: {},
};

// async function g() {
//   let usersinfo = await user.findAll({ where: { role: "owner" } });
//   for (let i = 0; i < usersinfo.length; i++) {
//     msgQueue.companies[usersinfo[i].username] = { req: {} };
//   }
// }
// g();
// setInterval(async function () {
//   g();
// }, 600000);
// customs.on("connection", (socket) => {
//   // console.log("customs connected", socket.id);
//   socket.on("rental-res", (payload) => {
//     customs.emit("res", payload);
//   });
// });
owners.on("connection", (socket) => {
  // console.log("owner connected", socket.id);
  socket.on("get-all", (payload) => {
    Object.values(msgQueue.companies[payload].req).forEach((id) => {
      owners.emit("all", id);
    });
  });
  socket.on("req-fromCus", async (payload) => {
    let id = payload.carid;
    // let carrecored = await car.findOne({ where: { id } });
    // let userinfo = await user.findOne({ where: { id: carrecored.ownerId } });
    // for (let i = 0; i < msgQueue.cars.length; i++) {
    //   if (msgQueue.cars[i][0] == payload.carid) {
    //     msgQueue.companies[msgQueue.cars[i][1]].req[
    //       payload.carid
    //     ] = `there is a customer need a car that has id:${payload.carid} from ${payload.startDate} to ${payload.endDate} `;

    //     break;
    //   }
    // }
    payload.ownerName = userinfo.username;
    msgQueue.companies[userinfo.username].req[
      payload.carid
    ] = `there is a customer need a car that has id:${payload.carid} from ${payload.startDate} to ${payload.endDate} `;

    owners.emit("rent-req", payload);
  });
});

drivers.on("connection", (socket) => {
  // console.log("driver connected");
  socket.on("custom-need-driver", (payload) => {
    drivers.emit("mission", payload);
  });
});
