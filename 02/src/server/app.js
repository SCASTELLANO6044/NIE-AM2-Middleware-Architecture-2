const express = require('express')
const app = express();
const cors = require('cors')

/*
    Here we enable cors to every website.
*/
app.use(cors({
    origin: "*"
}))

/*
    The next lines create a server that displays our html file.
*/
app.get('/',(req,res)=>{
    res.sendFile('./views/index.html', {root: __dirname});
})

/*
    This method defines on which port are we listen to.
*/
app.listen(3000);