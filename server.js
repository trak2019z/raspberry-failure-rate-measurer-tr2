console.log("Welcome! RFRM-Server v.0.3.0 is loading ...");

//--- Requires ---//
const app = require("./backend/app");
const debug = require("debug")("node-angular");
const http = require("http");

//--- Methods ---//
const onError = error => {
  switch(error.code) {
    case "EADDRINUSE":
    console.log("ERROR: EADDRINUSE - port " + port + " in use");
    process.exit(1);
  }
};

const onListening = () => {
  const addr = server.address();
  debug("Listening on " + addr);
};

//--- Server ---//
const port = process.env.port || "3000";
app.set("port", port);

const server = http.createServer(app);
server.on("error", onError);
server.on("listening", onListening);
server.listen(port);
