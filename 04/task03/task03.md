# Task 03

## Implement a simple HTTP server in Node.js

- implement a "http://localhost:8080/person/{person_name}/address" API, which returns the address of a person
- request: GET "http://localhost:8080/person/John/address", response "Thakurova 9, 160 00, Prague"
- the server should fetch the data from a Redis server. Redis runs in a separate container than the node.js server!

To implement this server I will use the ***express*** and ***redis*** module and run the next code  

```javascript
const express = require('express');
const redis = require('redis');

const HOST = process.env.HOST || '127.0.0.1'; 
const PORT = process.env.PORT || 6379;
const app = express();

var redisClient = redis.createClient(PORT, HOST);
redisClient.connect();
redisClient.on('connect', function() {
        console.log('Redis client connected');
});

app.get("*", async (req, res)=>{

    if (req.url.match(/\/person\/\w+\/address/)){
        const name = req.url.split('/')[2];
        try {
            const res = await redisClient.get(name, function(error, result){
                if (error) {
                    console.log(error);
                    throw error;
                }
            });
            res.send((JSON.stringify({ address: res})));
            res.end();
        } catch (redisErr) {
            res.send((JSON.stringify({ error: redisErr })));
            res.end();
        }
    }
})

app.listen(8080,()=>{
    console.log('Server listening on port: 8080')
})
```

Now to test our program we have to execute `node app.js` with our redis server running.

![](C:\CTU\Summer%20Semester\NIE-AM2%20Middleware%20Architectures%202\Gitlab\casteser\04\screenshots\Captura1.PNG)

Then, in our browser we could see the result od the query.

![](C:\Users\scast\AppData\Roaming\marktext\images\2022-04-14-16-54-52-image.png)


