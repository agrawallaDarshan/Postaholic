//run npm start to deploy the code
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fs = require("fs");
const router = require("./routes/auth");

const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
  path: "/socket.io",
  cors: {
    origin: [process.env.CLIENT_ORIGIN, process.env.LOCALHOST_ORIGIN],
    methods: ["GET", "POST"],
    allowHeaders: ["content-type"],
  },
});

app.get("/", (req, res) => {
  res.send({ message: "hello world" });
});

//connecting mongodb
mongoose
  .connect(process.env.DATABASE)
  .then(() => console.log("DB Connected Successfully"))
  .catch((err) => console.log("DB Connection err => ", err));

//middlewares
// app.use(bp.json()) looks at requests where the Content-Type: application/json header is present and transforms the text-based JSON input into JS-accessible variables under req.body. app.use(bp.urlencoded({extended: true}) does the same for URL-encoded requests. the extended: true precises that the req.body object will contain values of any type instead of just strings.
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: [process.env.CLIENT_ORIGIN, process.env.LOCALHOST_ORIGIN],
  })
);

//loading routers synchronously
fs.readdirSync("./routes").forEach((routeFile) => {
  // console.log(mongoose.Schema.ObjectId);
  app.use("/api", require(`./routes/${routeFile}`));
});

// io.on("connect", (socket) => {
//   // console.log("Socket ID", socket.id);
//   socket.on("send-message", (message) => {
//     // console.log("Message received =>", message);
//     socket.broadcast.emit("broadcast-message", message);
//   });
// });

io.on("connect", (socket) => {
  socket.on("send-user-post", (post) => {
    // console.log(post);
    socket.broadcast.emit("new-user-post", post);
  });
});

const port = process.env.PORT || 8000;

http.listen(port, () => {
  console.log("Backend server started successfully");
});
