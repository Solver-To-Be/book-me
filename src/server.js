const express = require("express");
const app = express();
const router = require("./routes/auth");
const errorHandler = require("./middleware/500");
const notFoundError = require("./middleware/404");
const cors = require("cors");
require("dotenv").config();

const PORT = process.env.PORT || 3030;
const http = require("http");

app.use(express.json());
app.use(cors());
app.get("/", (req, res) => {
  res.status(200).send("اهلا وسهلا ");
});

const server = http.createServer(app);
const { Server } = require("socket.io");
const caps = new Server(server);

const owners = caps.of("/owners");
const drivers = caps.of("/drivers");
const customs = caps.of("/customs");
const { user } = require("./models/index");
const { car } = require("./models/index");

let msgQueue = {
  companies: {
  },
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
  try {

    console.log("customs connected", socket.id);
    socket.on("rental-res", async (payload) => {
      console.log(payload);
      let id = payload.carid;
      // let takenId = payload.takenId;
      let carrecord = await car.findOne({ where: { id } });
      let userinfo = await user.findOne({ where: { id: carrecord.ownerId } });
      payload.userinfo = userinfo
      payload.carrecord = carrecord
      if (payload.status === "ok") {
        let recordObj = {
          ...carrecord,status:'taken'
        }
        await carrecord.update(recordObj);
      }
      customs.emit("res", payload);
      delete msgQueue.companies[userinfo.username].req[id]
      console.log(msgQueue.companies);

    });

  } catch (error) {
    throw new Error (error.message)     
  }

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
    try {
      console.log(msgQueue);
      let id = payload.carid;
      let carrecord = await car.findOne({ where: { id } });
      if (!carrecord) {
        payload.empty = 'notFound'
        customs.emit("res", payload);
      } else {
        let userinfo = await user.findOne({ where: { id: carrecord.ownerId } });
        payload.ownerName = userinfo.username;
        payload.carName = carrecord.name;
        msgQueue.companies[userinfo.username].req[
          payload.carid
        ] = payload;
        owners.emit("rent-req", payload);
        console.log(msgQueue.companies[userinfo.username].req);
      }
    } catch (error) {
     console.log(error.message)
    }
  });

});

drivers.on("connection", (socket) => {

  socket.on("req-driver",async (payload) => {
    let driversInfo = await user.findAll({ where: { status: "avaliable" } });
    payload.driver = driversInfo[0].username
    drivers.emit("trip", payload);
    let driverUpdate = await user.findOne({ where: { id: driversInfo[0].id } });
    let recordObj = {
      ...driverUpdate,status:'unavailable'
    }
    await driverUpdate.update(recordObj);
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
