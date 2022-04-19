# Task 7

## Design and implement simple SSE server in Node.js and simple client in HTML/JavaScript.

- The client connects to server and displays all incoming messages
- The server sends every 2 seconds one message - e.g. one line of text file.

Use http://nodejs.org and http module.

To finish this task I have created a server which implements server-sent events.

Our browser will use the EventSource API, which links to a server that pushes event stream messages.

### Result:

#### Console:

Every 2 seconds the server will push a message.

```
PS C:\CTU\Summer Semester\NIE-AM2 Middleware Architectures 2\Gitlab\casteser\07\src> node .\server.js
Server listening on port 8080
1
2
3
4
```

#### Browser:

The browser gets pushed event stream messages and it will printed in the webpage

![](C:\Users\scast\AppData\Roaming\marktext\images\2022-04-17-20-37-02-image.png)
