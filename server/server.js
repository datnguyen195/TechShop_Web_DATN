const express = require("express");
require("dotenv").config();
const dbConnect = require("./config/dbconnect");
const initRoutes = require("./routes");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");
const socket = require("./middlewares/socketio");

const app = express();
app.use(
  cors({
    origin: "https://techshop-web-datn.onrender.com",
    methods: ["POST", "GET", "PUT", "DELETE"],
  })
);
app.use(cookieParser());
const port = process.env.PORT || 8888;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

dbConnect();
initRoutes(app);

const server = http.createServer(app);

socket.init(server);

server.listen(port, () => {
  console.log("Server running on the port: " + port);
});
