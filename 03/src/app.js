const express = require('express')

/*
    Create the server.
*/
const app = express()

/*
    If "/John is requested with reply greating John".
*/
app.get("/John", (req, res)=>{
    res.send('Hello John')
})

/*
    Port in which our app listen.
*/
app.listen(8080)