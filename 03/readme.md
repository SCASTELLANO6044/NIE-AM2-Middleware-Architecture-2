# Homework 03

This task consists on: 

- Implement a simple HTTP server in Node.js
  - implement a "hello NAME" service endpoint
  - request: "http://localhost:8080/John", response "Hello John"
- Define an image Dockerfile, with the following specifications:
  - build on a chosen node.js image
  - the container should listen on port 8888
  - load the server implementation from a local directory
  - run the server
- Create a docker image from the Dockerfile
- Create a container for the image
  - tip: use the **-p** parameter to map public port to a private port inside the container (e.g. -p 8080:8888)
- Check if the container is running (docker container ls)
- Send several requests to the server running within the container
  - you can use ping, curl or telnet for testing
- Stop the container

## Implementation

To achive those goals I have had to create a docker image which implements a server on node.js that will display the message "Hello John" in case the "http://localhost:8080/John" request is executed by a client the code of the server is this:

```javascript
const express = require('express')

const app = express()

app.get("/John", (req, res)=>{
    res.send('Hello John')
})

app.listen(8080)
```

On the docker side the code of the Dockerfile is very simple:

```docker
FROM node:lts-alpine3.15
COPY . /app
WORKDIR /app
CMD node app.js
```

I have decided to use the image __*lts-alpine3.15*__ because it's one of the lightest images so resulting image doesn't weight to much. To create the image we just have to execute in our terminal from the folder in wich our Dockerfile is located `docker build -t homework03 .`

## Installation

To run this server due to it is implemented in docker we just need to have installed docker in our PC and also have the docker image downloaded, this is the main advantage of developing services in docker, the fact that the image will contain all the requiered dependecies to run.

After downloading the image we need to run the image by executing this command on our terminal `docker run -p 8080:8080 homework03`

## How it works

Once everything is running and there is no error messages in our terminal we can open our favourite web browser and type on the search bar __*localhost:8080/John*__ 
