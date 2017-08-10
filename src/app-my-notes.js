// must change to app.js to work
const bodyParser = require('body-parser');
const express = require('express');
// fs is used to read & write files
const fs = require('fs');

// create server. express() It's a server object
const server = express();
server.use(bodyParser.json());

const STATUS_USER_ERROR = 422;
// when the server/client recieves an http request(get) to /(root point)
// we go ahead an execute the function request, reponse.
// req: contains metadata res: ways to respond to the client
server.get('/greet-me/:name', (req, res) => {
  // localhost:3000/great-me?name=johnny <== this is a query string 
  // /:name uses req.params, takes in all parameters, its not embeded like query, its a url parameter
  const name = req.params.name;
  if (!name) {
    res.status(STATUS_USER_ERROR);
    res.json({ error: 'Must provide a name'});
    return;
  }
  res.send(`<h1>Hello${name}</h1>`);
});

server.get('/test', (req, res) => {
  fs.readFile('./src/index.html', 'utf8', (err, contents) => {
    if (err) {
      throw err;
    }
    res.send(contents);
  });
});

server.get('/lesson-plan', (req, res) => {
  const lessonPlan = {
    title: 'Node.js and Express',
    tagline: 'Server-side Javascript',
    // . . .
  };
  // // res.set structure json data down to the client
  // res.type('json');
  // // res.set('Content-type', 'application/json');
  // res.send(JSON.stringify(lessonPlan));

  // is the same as the 2 lines above combined!
  res.json(lessonPlan)
});

// creating a post on fb, registering an account etc
const tasks = [];

server.post('/tasks', (req, res) => {
  const task = req.body.task;
  if (!task) {
    res.status(STATUS_USER_ERROR);
    res.json({ error: 'Must provide a task'});
    return;
  }
  tasks.push(task);
  res.json({ tasks });
});

server.listen(3000);

// JSON = JavaScript Object Notation
// A way to represent a JavaScript object as a string
// Convert object to string - "serialization"
// convert string back to object - "deserialization"
//
// Json.stringify(object) converts object to a string