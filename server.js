const cluster = require("node:cluster");
const os = require('os');
const totalCPUs = os.cpus().length;
console.log(totalCPUs);
const index = require('./index');

const mongoose = require("./config/db");

if (cluster.isPrimary) {
    
    for( i=0; i<totalCPUs; i++){
        cluster.fork();
    }
    
    cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
      });

} else {
    index;
//     //var db = mongoose.connection;
//     const express = require("express");
//     const app = express();
    
//     const http = require("http");
//     const server = http.createServer(app);

//     let PORT = process.env.PORT || 5001;
//     app.get("/", async (req, res, next) => {
//         res.send("check");
//         return res.status(200).json({ status: 200, message: "Dreamub" });
//       });

// server.listen(PORT, () => {
//   console.log(`Server is running on PORT http://localhost:${PORT} ${process.pid}`);
// });




//   db.on("error", console.error.bind(console, "connection error:")),
//   db.once("open", async function () {
//     console.log("db connected!");
   
//   });
}