const express = require("express");
const app = express();
const router = require("./routes/auth");
const errorHandler = require("./middleware/500");
const notFoundError = require("./middleware/404");
require("dotenv").config();

const PORT = process.env.PORT || 3030;

const http = require("http");


// app.use(cors())
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.status(200).send("اهلا وسهلا ");
});
("use strict");
require("dotenv").config();
const server = http.createServer(app);
const { Server } = require("socket.io");
const caps = new Server(server);

const owners = caps.of("/owners");
const drivers = caps.of("/drivers");
const customs = caps.of("/customs");
const { user } = require("./models/index");
const { car } = require("./models/index");
const msgQueue = {
  companies: {},
};

async function g() {
  let usersinfo = await user.findAll({ where: { role: "owner" } });
  for (let i = 0; i < usersinfo.length; i++) {
    msgQueue.companies[usersinfo[i].username] = { req: {} };
  }
}

g();
setInterval(async function () {
  g();
}, 600000);

customs.on("connection", (socket) => {
  console.log("customs connected", socket.id);
  socket.on("rental-res", (payload) => {
    customs.emit("res", payload);
  });
});

owners.on("connection", (socket) => {
  console.log("owner connected", socket.id);
  socket.on("get-all", (payload) => {
    Object.values(msgQueue.companies[payload].req).forEach((id) => {
      owners.emit("all", id);
    });
  });

  socket.on('getLocation', (payload) => {
    socket.emit('getLocation', payload)
  })

  socket.on("req-fromCus", async (payload) => {
    let id = payload.carid;
    let carrecored = await car.findOne({ where: { id } });
    let userinfo = await user.findOne({ where: { id: carrecored.ownerId } });
    payload.ownerName = userinfo.username;
    payload.carName = carrecored.name
    msgQueue.companies[userinfo.username].req[
      payload.carid
    ] = `there is a customer need a car that has id:${payload.carid} has name${payload.carName} from ${payload.startDate} to ${payload.endDate} `;
    console.log(msgQueue.companies[userinfo.username].req);
    owners.emit("rent-req", payload);
  });
});

drivers.on("connection", (socket) => {  
  socket.on("custom-need-driver", (payload) => {
    drivers.emit("mission", payload);
  });
});

app.use(router);
app.use("*", notFoundError);
app.use(errorHandler);

function start() {
  server.listen(PORT, () => {
    console.log(`server is standing on ${PORT}`);
  });
}

module.exports = {
  start: start,
};
