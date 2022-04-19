# Homework 02

This task consist on: 

- Create a simple HTML page with an info text field and a single button
- Implement a JavaScript function which is triggered when the button is clicked
  - The function should fetch relatively large file (e.g. 100-200MB)
  - in the text field show following states:
    - loading - when the open method was called
    - loaded - when the send method was called
    - downloading - while the data is being downloaded
    - finished downloading - when the data has beeen downloaded
- you can use Promise, async/await.

## Implementation

To achive those goals I have decided to create a server on node.js that will launch a html webpage which has a JavaScript function that executes the demanded tasks.

## Instalation

- To test this homework you will have to download the folder called "server" which contains all the required files, you should have previously installed in your computer node.js to be able to run the server.
- The packages used in this project are "Cors" and "Express" at the time of creating the server.
- You can add Cors library by executing the next command in your terminal: `npm i cors`
- Once you have everything downloaded you have to open a terminal and navegate through your files to the folder of your project and execute `node app.js`and after that you can simply open your browser, open a new tab and type _**localhost:3000**_

## How it works

You must paste a download link of a file in the textfield item and then click on the button and you will see how the _**status**_ label changes it's status depending on which phase of the download the program is, besides you can find this changes too in the console of the browser.

![screenchot](C:\Users\scast\Downloads\Captura.PNG)

### Problems

I have had problems with the cors that's why finally I have decided to implement a server on which I have permited cors to every origin insted of just creating an html file with the JavaScript Function on it.
