/**
 * create an http2 server
 */
const http2 = require("http2");
const fs = require('fs')
const mime = require('mime')

const HTTP2_PORT = 8443;

const serverOptions = {
  key: fs.readFileSync(__dirname + "/secret/localhost-privkey.pem"),
  cert: fs.readFileSync(__dirname + "/secret/localhost-cert.pem")
};

// read and send file content in the stream
const sendFile = (stream, fileName) => {
  const fd = fs.openSync(fileName, "r");
  const stat = fs.fstatSync(fd);
  const headers = {
    "content-length": stat.size,
    "last-modified": stat.mtime.toUTCString(),
    "content-type": mime.getType(fileName)
  };
  stream.respondWithFD(fd, headers);
  stream.on("close", () => {
    fs.closeSync(fd);
  });
  stream.end();
};

const pushFile = (stream, path, fileName) => {
  stream.pushStream({ ":path": path }, (err, pushStream) => {
    if (err) {
      throw err;
    }
    sendFile(pushStream, fileName);
  });
};

// handle requests
const http2Handlers = (req, res) => {
  if (req.url === "/") {
    // push style.css
    pushFile(res.stream, "/style.css", "style.css");

    // push the script
    pushFile(res.stream, "/scripts/main.js", __dirname+"/scripts/main.js");
    
    // push the image
    pushFile(res.stream, "/images/img1.jpg", __dirname+"/images/img1.jpg");

    // lastly send index.html file
    sendFile(res.stream, "index.html");
  } else {
    // send empty response for favicon.ico
    if (req.url === "/favicon.ico") {
      res.stream.respond({ ":status": 200 });
      res.stream.end();
      return;
    }
    const fileName = __dirname + req.url;
    sendFile(res.stream, fileName);
  }
};

http2
  .createSecureServer(serverOptions, http2Handlers)
  .listen(HTTP2_PORT, () => {
    console.log("http2 server listening on port:", HTTP2_PORT);
  });