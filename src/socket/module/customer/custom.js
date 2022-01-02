// "use strict";

// const io = require("socket.io-client");
// const host = "https://book-me-car.herokuapp.com";
// const ownersConnection = io.connect(`${host}/owners`);
// const customConnection = io.connect(`${host}/customs`);
// const driverConnection = io.connect(`${host}/drivers`);

// let pickup = {
//   carid: `${process.argv[2]}`,
//   startDate: `${process.argv[3]}`,
//   endDate: `${process.argv[4]}`,
//   driver: `${process.argv[5]}`
// };

// if (pickup.carid === "undefined") {
//   console.log("please enter a car id");
// } else if (pickup.startDate === "undefined") {
//   console.log("please enter a start date ");
// } else if (pickup.endDate === "undefined") {
//   console.log("please enter end date");
// } else {
//   ownersConnection.emit("req-fromCus", pickup);
//   console.log("wait the accepted from the owner");
//   customConnection.on("res", (payload) => {
//     if (pickup.carid === payload.carid && payload.status === "refused") {
//       console.log("your rental request has been rejected");
//     }
//     if (pickup.carid === payload.carid && payload.status === "ok") {
//       console.log("Your rental request has been accepted");
//       if (pickup.driver === 'yes') {
//         driverConnection.emit('req-driver', payload)
//       }
//     }
//     if (payload.empty === 'notFound') {
//       console.log(`there is no car with the id : ${payload.carid}`);
//     }

//   });
// }