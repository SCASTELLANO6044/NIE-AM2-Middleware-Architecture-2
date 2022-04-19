const net = require('net');
const crypto = require('crypto');
let tasks = {};

const server = net.createServer((c) => {
    const sid = crypto.randomUUID();
    console.log('Session started succesfully for id:', sid);
    tasks[sid] = { socket: c, state: null };
    c.setEncoding('utf8');

    /*
    Here we code the server behaviour depending on what the server
    gets as data
    */
    c.on('data', (data) => {
        data = data.toString().replace(/[^a-z\-\/A-Z\d ]/gm, "");

        /*
        In this case we are on statefull server so we need to consider the
        session id on every step we take if we recieve an "openOrder" comand
        first we check if the order hasn't been opened before and if it hasn't
        we will open it otherwise we can not open it.
        */
        if (data.includes("POST /openOrder")) {
            if (tasks[sid].state == null) {
                tasks[sid].state = 'opened';
                c.write(`Opened Order for user with sid:  ${sid}\n`);
            } else {
                c.write(`Cannot Open for user with sid:  ${sid}\n`);
            }

        /*
        If we are asked to add an order we need to first check according
        to our session if it has been previously opened if it has been
        opened it we will change the sate to opened.
        */
        } else if (data.includes('POST /addOrder')) {
            if (tasks[sid].state == 'opened') {
                tasks[sid].state = 'added';
                c.write(`Added Order for user with sid: ${sid}\n`);
            } else {
                c.write(`Cannot Add Order for user with sid: ${sid}\n`);
            }

        /*
        When we will recive a process order comand we will have to repit
        the steps of the previous else if but in this case we are interested
        on checking if the order of this particular sesion has been added
        before
        */
        } else if (data.includes('POST /processOrder')) {
            if (tasks[sid].state == 'added') {
                tasks[sid].state = 'processed';
                c.write(`Processed order for user with sid: ${sid}\n`);
            } else {
                c.write(`Cannot Process Order for user with sid: ${sid}\n`);
            }
        }
    });

    /*
    If server is closed we delete the tasks and close the for this
    particular sesion socket.
    */
    c.on('end', () => {
        console.log('Session closed for client with id: ', sid);
        delete tasks[sid];
        tasks[sid].socket.end();
    });
});

/*
This method defines which port the server is going to listen to and 
a callback function which I'm going to use to get feedback from the
server trought the console leting me know that everything has gone
well and the server is running
*/
server.listen(3000, () => {
    console.log(`Server running on port 3000`);
});