//run npm start to deploy the code
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const fs = require("fs");
const router = require("./routes/auth");

app.get("/", (req, res) => {
  res.send({"message":"hello world"});
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
    origin: ["http://localhost:3000"],
  })
);

//loading routers synchronously
fs.readdirSync("./routes").forEach((routeFile) => {
  console.log(routeFile);
  app.use("/api", require(`./routes/${routeFile}`));
});

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log("Backend server started successfully");
});
