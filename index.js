const express = require('express');

const server = express();

// Necessary to use JSon on POST
server.use(express.json());

const proj = JSON.parse('{ "projects": [] }');
var requests = 0;

// count the number of requests
function ReqCount(req, res, next) {
  requests++;
  console.log(`Number of requests: ${requests}`);
  return next();
}

// Middlewares can change the variables req, and res, before continue
function checkValidProject(req, res, next) {
  const { id } = req.params;

  // Return the index of the element by id
  const index = proj.projects.findIndex((pro, i) => {
    return pro.id === id;
  });

  if (index === -1) {
    return res.status(400).json({ error: 'Project not found!' });
  }

  req.index = index;

  return next();
}

// Add a new project
server.post('/projects', ReqCount, (req, res) => {
  const project = req.body;

  proj.projects.push(project);

  return res.json(proj);
});

// List all Projects
server.get('/projects', ReqCount, (req, res) => {
  return res.json(proj);
});

// Edit a project title by id
server.put('/projects/:id', checkValidProject, ReqCount, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  // return the element by id
  /*
  const project = proj.projects.filter(pro => {
    return pro.id === id;
  });
  */

  proj.projects[req.index].title = title;

  //project[0].title = title;

  return res.json(proj);
});

// Delete a project by id
server.delete('/projects/:id', checkValidProject, ReqCount, (req, res) => {
  const { id } = req.params;

  // Return the index of the element by id
  /*
  const index = proj.projects.findIndex((pro, i) => {
    return pro.id === id;
  });
  */

  proj.projects.splice(req.index, 1);

  return res.send();
});

// Add a new task to a project by id
server.post('/projects/:id/tasks', checkValidProject, ReqCount, (req, res) => {
  const { id } = req.params;
  const { title } = req.body; // Title of the task

  // return the element by id
  /*
  const project = proj.projects.filter(pro => {
    return pro.id === id;
  });
  */

  proj.projects[req.index].tasks.push(title);
  //project[0].tasks.push(title);

  return res.json(proj);
});

server.listen(3333);
