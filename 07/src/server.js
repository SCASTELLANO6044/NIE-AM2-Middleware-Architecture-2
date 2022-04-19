const http = require('http');

const PORT = process.env.PORT || 8080;

const server = http.createServer((request, response) => {
  response.writeHead(200, {
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache'
  });

  let id = 1;
  // Event streaming.
  setInterval(() => {
    response.write(
      `Event: Recieving message\nid: ${id}\nData: Printing messagge #${id}.\n\n`
    );
    console.log(id);
    id++;
  }, 2 * 1000);
});

// Listen.
server.listen(PORT, ()=>{
    console.log(`Server listening on port ${PORT}`);
});