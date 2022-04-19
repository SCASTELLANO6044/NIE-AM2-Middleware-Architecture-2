# Task 4

## Define an image Dockerfile (for the node.js server), with the following specifications:

- build on a chosen node.js image
- load the server implementation from a local directory
- run the server
- Create a docker image from the Dockerfile
- Create and run a container
- Test the server - it shoudl return the address for a person retrieved from the linked redis server container

To complete this task we need to create a docker image with the code of the task 3, and then create a container which will be connected to the ***redis_server*** container.

To create the image we need to create a ***Dockerfile*** with this code  

```dockerfile
FROM node:lts-alpine3.15
COPY . /app
WORKDIR /app
CMD node app.js
```

Then we have to execute the command `docker build -t node_server .`

![](C:\Users\scast\AppData\Roaming\marktext\images\2022-04-14-17-15-06-image.png)

After this we are going to create the container linked to the redis server with the command `docker run -it -p 8080:8080 --link redis_server node_server`

![](C:\Users\scast\AppData\Roaming\marktext\images\2022-04-14-17-16-51-image.png)

Finally if we execute the query in our browser we will get the same result as in the task 03.

![](C:\Users\scast\AppData\Roaming\marktext\images\2022-04-14-17-18-17-image.png)
