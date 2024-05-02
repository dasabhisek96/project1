'use strict';

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap({ strapi }) {
    const {Server} = require('socket.io');
    const axios = require("axios");
    let io = new Server(strapi.server.httpServer,{
      cors:{
        origin: "http://localhost:1337",
        methods: ["GET", "POST"],
        allowedHeaders:["my-custom-header"],
        credentials: true
      }
    });
    io.on("connection", function (socket) {
      socket.on("join", async ({ username }) => {
        console.log("user connected");
        console.log("username is ", username);
        if (username) {
          console.log("username enter ", username);
          socket.emit("welcome", {
            user: "bot",
            text: `${username}, Welcome to the group chat`,
            userData: username,
          });
        } else {
          console.log("e no work");
        }
      });
      socket.on("sendMessage", async (data) => {
        let strapiData = {
          data: {
            user: data.username,
            message: data.message,
          },
        };
        console.log(`----strapiData----${JSON.stringify(strapiData)}`)
        await axios
            .post("http://localhost:1337/api/messages", strapiData)
            .then(async (e) => {
              console.log(`---success-e-----,${e}`);
              socket.emit("roomData", { done: "true" });
            })
            .catch((e) => {
              console.log(`-----e-----,${e}`);
              if (e.message == "Request failed with status code 400") {
                socket.emit("roomData", { done: "existing" });
              }
            });
        socket.emit("message", {
          user: data.username,
          text: data.message,
        });
      });
    });
  },
};
