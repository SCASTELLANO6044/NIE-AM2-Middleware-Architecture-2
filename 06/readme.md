# Task 6

## Implement an HTTP/2 push mechanism

- - Implement a simple HTML page consisting of at least 3 additional resources (e.g. css, js, image, ..)
  - Implement a simple http server serving the page via HTTP/2
  - When the html page is requested, push all those files together with the requested page
- Use http2 module

To implement a http2 server I needed to implement the next modules: fs, mime, the only one which is required to be installed with the command `npm install mime`; and http2. 

First thing we need to do to run a http2 server is to have a certificate and a private key which we can generate with openssl commands, most specifically this one:

`openssl req -x509 -newkey rsa:2048 -nodes -sha256 -subj '/CN=localhost' -keyout localhost-privkey.pem -out localhost-cert.pem`. This process is needed because a http2 server is a secure server so we need to use https protocol.

![Captura1.PNG](C:\CTU\Summer%20Semester\NIE-AM2%20Middleware%20Architectures%202\Gitlab\casteser\06\screenshots\Captura1.PNG)

Next step is to code a server which uses push method to load the files by the time a request is made, for this I have implemented a node js server with the next code: 

```javascript
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
    console.log("closing file", fileName);
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
  console.log(req.url);
  if (req.url === "/") {
    // push style.css
    pushFile(res.stream, "/style.css", "style.css");

    // push all files in scripts directory
    const files = fs.readdirSync(__dirname + "/scripts");
    for (let i = 0; i < files.length; i++) {
      const fileName = __dirname + "/scripts/" + files[i];
      const path = "/scripts/" + files[i];
      pushFile(res.stream, path, fileName);
    }

    // push all files in images directory
    const imageFiles = fs.readdirSync(__dirname + "/images");
    for (let i = 0; i < imageFiles.length; i++) {
      const fileName = __dirname + "/images/" + imageFiles[i];
      const path = "/images/" + imageFiles[i];
      pushFile(res.stream, path, fileName);
    }

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
    console.log("http2 server listening on port", HTTP2_PORT);
  });
```

If we run the server with the command `node ./index.js` in a terminal and we try to open ***https://localhost:8443*** in our favourite browser we will see the result of our work.

![](C:\Users\scast\AppData\Roaming\marktext\images\2022-04-17-10-34-34-image.png)

First we will recive  warning because our certificate is made from ourself, this is a good sign which indicates that the server is doing it's work, we will skip this warning saying to the browser that anyway we want to access to the webpage.

![Captura.PNG](C:\CTU\Summer%20Semester\NIE-AM2%20Middleware%20Architectures%202\Gitlab\casteser\06\screenshots\Captura.PNG)

Once we have acces to our page if we inspect the web page on the network tab we will see that our files has been loaded by push method.

HTTP/2 will make our applications faster, simpler, and more robust — a rare combination by allowing us to undo many of the HTTP/1.1 workarounds previously done within our applications and address these concerns within the transport layer itself. The primary goals for HTTP/2 are to reduce latency by enabling full request and response multiplexing, minimize protocol overhead via efficient compression of HTTP header fields, and add support for request prioritization and server push.

To sum up, http2 push method loads every file that is needed in the website without needing a request for each file which speeds up the process and will let us have more efficient and fast websites.


