const express = require('express');
const server = express();

// Necessary to use JSon on POST
server.use(express.json());

// Query params = ?test=1  (req.query.test)
// Route params = /users/1 (/users/:id  - req.params.id, or const { id } = req.params)
// Request body = {"name":"Marcos"}
const users = ['Marcos', 'Eduardo', 'Mathias'];

// This is a middleware
// middleware is a intercept function. Without the next, it will not allow execute anything after it.
server.use((req, res, next) => {
  console.time('MyTimer');
  console.log(`Method: ${req.method}; URL: ${req.url};`);
  //return next();
  // It will execute all routes before junt to anything after next
  next();
  console.timeEnd('MyTimer');
});

// Middlewares can change the variables req, and res, before continue
function checkUserExists(req, res, next) {
  if (!req.body.name) {
    return res.status(400).json({ error: 'User name is required!' });
  }

  return next();
}

function checkUserIndex(req, res, next) {
  const user = users[req.params.index];

  if (!user) {
    return res.status(400).json({ error: 'User does not exist!' });
  }

  req.user = user;

  return next();
}

// CRUD - Create, Read, Update, Delete
server.get('/users', (req, res) => {
  return res.json(users);
});

// Get User
server.get('/users/:index', checkUserIndex, (req, res) => {
  //const { index } = req.params;

  //return res.json({ message: 'Hellow!' });
  //return res.json(users[index]);
  return res.json(req.user);
});

// Add user
server.post('/users', checkUserExists, (req, res) => {
  const { name } = req.body;

  users.push(name);

  return res.json(users);
});

// Edit user
server.put('/users/:index', checkUserExists, checkUserIndex, (req, res) => {
  const { index } = req.params;
  const { name } = req.body;

  users[index] = name;

  return res.json(users);
});

// Delete user
server.delete('/users/:index', checkUserIndex, (req, res) => {
  const { index } = req.params;

  // take the array at index "index" and remove the number of elements (1)
  users.splice(index, 1);

  return res.send();
});

server.listen(3000);
