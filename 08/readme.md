# Task 8

## OAuth - Browser-Based App

Design and implement a simple OAuth - Browser-Based App. Browser-based apps run entirely in the browser after loading the source code from a web page.

- Use a simple server (https) for serving static content (html, js, …​).
- Configure any OAuth application of your choice.
- You can use any OAuth solution as authorization and resource server: Google, GitHub, …​
- The app in browser connects to the authorization server and allows access to the resources.
- The app collects an presents in the browser any resource from the resource server using the provided code/token (e.g. list of contacts, files, messages, repositories, …​)
- Do not use any OAuth library (e.g. GoogleAuth, …​)

To achive this task I have decided to implement a simple https server with this code:

```javascript
const https = require('https');
const fs = require('fs');

const PORT = process.env.PORT || 8888;

const options = {
  key: fs.readFileSync('localhost-privkey.pem'),
  cert: fs.readFileSync('localhost-cert.pem')
};

https.createServer(options, (req, res) => {
  res.writeHead(200, { 
    'content-type': 'text/html',
    'Cache-Control': 'no-cache',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'X-Requested-With'
  });

  res.end(fs.readFileSync("index.html"));
}).listen(PORT, ()=>{
    console.log(`Server listening on port: ${PORT}`);
});
```

As we can see in this code  we just create a server which will send the `index.html` file which will contain another script which will fetch the data from the ***people google api***. 

Now before going on our html file we have to create the OAuth and API credentials.

In this part of the task we will go to ***https://console.cloud.google.com/*** and sign in with a google account, then go to **Credentials** and create a new credential for clients OAuth 2.0 on which we will go to **Constent OAuth** page and we will search for the section **Testing users** and we will add a google account.

![Captura.PNG](C:\CTU\Summer%20Semester\NIE-AM2%20Middleware%20Architectures%202\Gitlab\casteser\08\results\Captura.PNG)

After this step, we must go to the **Library** secction and search for **People** and install the google people api.![](C:\Users\scast\AppData\Roaming\marktext\images\2022-04-19-17-27-44-image.png)

Now we can go again to the **credential** section and we just need to add a API key credential.

![Captura2.PNG](C:\CTU\Summer%20Semester\NIE-AM2%20Middleware%20Architectures%202\Gitlab\casteser\08\results\Captura2.PNG)

After this I have implemented the `index.html` file which will use the **CLIENT_ID** and **CLIENT_SECRET** taken from the OAuth 2.0 credential

```html
<!DOCTYPE html>
<html>
<head>
    <title>Task 8</title>
    <script>
        const CLIENT_ID = '119043356343-bc3qrgskr0iphg7olrgl1k4vnjp1d67i.apps.googleusercontent.com';
        const CLIENT_SECRET = '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';
        const REDIRECT_URI = 'https://localhost:8888/callback';
        const OAUTH2_ENDPOINT = 'https://accounts.google.com/o/oauth2/v2/auth';
        const SCOPE = 'https://www.googleapis.com/auth/contacts.readonly';

        console.log(window.location.pathname);

        function buttonCallback() {
            window.location.replace(`${OAUTH2_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=token&scope=${SCOPE}&include_granted_scopes=true&state=pass-troughvalue`);
        }

        function addContact(name, number) {
            var node = document.createElement("p");
            var textnode = document.createTextNode(`${name}: ${number}`);
            node.appendChild(textnode);
            document.getElementById("contacts").appendChild(node);
        }

        function processCallback(token) {
            console.log(token);

            fetch('https://people.googleapis.com/v1/people/me/connections?personFields=names,phoneNumbers&pageSize=1000', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            })
            .then(response => response.json())
            .then(data => {
                data.connections.map(contact => {
                    if (contact.hasOwnProperty('names') && contact.hasOwnProperty('phoneNumbers')) {
                        addContact(contact.names[0].displayName, contact.phoneNumbers[0].canonicalForm);
                    }
                });
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        }

        if (window.location.pathname === '/callback') {
            // Parse url paramaters.
            const queryString = window.location.hash;
            const urlParams = new URLSearchParams(queryString);
            if (urlParams.has('access_token')) {
                processCallback(urlParams.get('access_token'));
            };
        }
    </script>
</head>
<body>

<button onclick="buttonCallback()">Google login</button>

<h2>Contacts:</h2>

<div id="contacts">

</div>
</body>
</html>
```

Now we will see the result of all this process in the next screenshots, we just have to run the server with the command `node ./server.js`, search on our browser ***https://localhost:8888*** then sign in with our google account and the data of our contacts is going to be displayed.

![Captura3.PNG](C:\CTU\Summer%20Semester\NIE-AM2%20Middleware%20Architectures%202\Gitlab\casteser\08\results\Captura3.PNG)

![Captura4.PNG](C:\CTU\Summer%20Semester\NIE-AM2%20Middleware%20Architectures%202\Gitlab\casteser\08\results\Captura4.PNG)

![Captura5.PNG](C:\CTU\Summer%20Semester\NIE-AM2%20Middleware%20Architectures%202\Gitlab\casteser\08\results\Captura5.PNG)

![](C:\Users\scast\AppData\Roaming\marktext\images\2022-04-19-17-42-32-image.png)


