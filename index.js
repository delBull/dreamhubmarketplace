const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("./config/db");
const morgan = require("morgan");
const cors = require("cors");
const routes = require("./routes");
const Moralis = require("moralis").default;
// const { EvmChain } = require("@moralisweb3/evm-utils");
const app = express();

// Web 3
const Web3 = require("web3");

var web3 = new Web3(
  new Web3.providers.HttpProvider(
    // "http://127.0.0.1:8545"
    "https://data-seed-prebsc-1-s1.binance.org:8545"
  )
);

// Socket
const http = require("http");
const { Server } = require("socket.io");
const { default: axios } = require("axios");
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*", methods: "*" } });

// var web3 = new Web3(Web3.givenProvider);
// const web3 = new Web3(Web3.givenProvider);
// console.log(web3);
// console.log(web3.eth);
// * Database connection

var db = mongoose.connection;

//this is my repo

db.on("error", console.error.bind(console, "connection error:")),
  db.once("open", async function () {
    console.log("db connected!");
    await connectMoralis();
  });

const connectMoralis = async () => {
  const checkMorlis = await Moralis.start({
    apiKey: "lrjyYpDNgavPt3pF9a1yuiauaL2VKfnNRbn75lTroqZPY5YHO4kLO974B80w5VgV",
    formatEvmAddress: "checksum",
    formatEvmChainId: "decimal",
    logLevel: "verbose",
  });
};

// * Cors
app.use(
  cors({
    origin: "*",
    credentialsL: "*",
  })
);

// * Body Parser
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(morgan("short"));

// * Api routes
app.use(
  "/api/v1",
  (req, res, next) => {
    req.web3 = web3;
    req.Web3 = Web3;
    req.io = io;
    next();
  },
  routes
);

app.get("/", async (req, res, next) => {
  res.send("check");
  return res.status(200).json({ status: 200, message: "Dreamub" });
});

io.on("connection", (socket) => {
  //when connect
  console.log("New client connected with id: ", socket.id);

  //when disconnect
  socket.on("disconnect", () => {
    console.log("a user disconnected!", socket.id);
  });
});

app.use("*", (req, res) => {
  res.status(404).send("Route not found");
});

let PORT = process.env.PORT || 5001;

server.listen(PORT, () => {
  console.log(`Server is running on PORT http://localhost:${PORT} ${process.pid}`);
});
