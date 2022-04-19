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