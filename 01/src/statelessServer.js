const net = require('net');
const crypto = require('crypto');
let tasks = {};

const server = net.createServer((c) => {
    let sid;
    console.log('Session started succesfully');
    c.setEncoding('utf8');
    /*
    Here we code the server behaviour depending on what the server
    gets as data
    */
    c.on('data', (data) => {
        data = data.toString().replace(/[^a-z\-\/A-Z\d ]/gm, "");

        /*
        In case we open an order we will asign a random id to the oder
        because we are in stateless server and store in an array this order
        and it's state
        */
        if (data.includes("POST /openOrder")) {
            sid = crypto.randomUUID();
            tasks[sid] = {state: 'order opened'};
            c.write(`Opened: ${sid}\n`);

        /*
        If we are asked to add an order we just have to change the
        state parameter to "order added" in the object which is 
        storing our orders.
        */
        } else if (data.includes('POST /addOrder')) {
            const req = data.split("/");
            const reqId = req[req.length - 1];
            try {
                tasks[reqId].state = 'order added';
                c.write(`Added: ${reqId}\n`);
            } catch (error) {
                c.write(error)
            }
        
        /*
        This is the same case as we have seen in the previous else if
        but in this case we will store "order processed".
        */
        } else if (data.includes('POST /processOrder')) {
            const req = data.split("/");
            const reqId = req[req.length - 1];
            try {
                tasks[reqId].state = 'order processed';
                c.write(`Processed: ${reqId}\n`);
            } catch (error) {
                c.write(error)
            }
        }
    });

    /*
    If server is closed we delete the tasks and close the socket.
    */
    c.on('end', () => {
        console.log('Session closed');
        delete tasks[sid];
        c.end();
    });
});

/*
This method defines which port the server is going to listen to and 
a callback function which I'm going to use to get feedback from the
server trought the console leting me know that everything has gone
well and the server is running
*/
server.listen(3000, () => {
    console.log(`Server listening on port 3000`);
});