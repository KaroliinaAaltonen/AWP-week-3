var express = require('express');
const bodyParser = require('body-parser');
var router = express.Router();

router.use(bodyParser.json());

let users = [];

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', { title: 'My todos' });
});

router.post('/todo', (req,res) => {
  const { name, task } = req.body;
  // returns the index of the first element in the array that satisfies the provided testing function
  const userIndex = users.findIndex(user => user.name === name);
  if (userIndex !== -1){
    // user with the name exists already
    users[userIndex].todos.push(task);
    res.send(`Todo ${task} added for ${name}.`);
  } else {
    // create new user
    users.push({ name, todos: [task] });
    res.send(`User ${name} and Todo ${task} added.`);
  }
})

router.get('/user/:id', (req, res) => {
  const { id } = req.params;
  const user = users.find(user => user.name === id);
  if (user){
    // user exists
    const userData = {
      id: user.name,
      todos: user.todos
    };
    res.json(userData);
  } else{
    // user was not found
    res.status(404).send(`User ${id} does not exist.`);
  }
})
router.delete('/delete/:id', (req, res) => {
  const { id } = req.params;
  const userIndex = users.findIndex(user => user.name === id);
  if (userIndex !== -1){
    // User exists
    // Delete all todos of the user
    users[userIndex].todos = [];
    // Remove the user from the array
    users.splice(userIndex, 1);
    res.send('User and all todos deleted');
  } else {
    res.status(404).send('User not found');
  }
})

// allows PUT requests to /user with the username specified as a query parameter, like /user?name=johndoe.
router.put('/user', (req, res) => {
  const { name } = req.query;
  const taskIndex = req.body.index;
  console.log(name, taskIndex);
  const userIndex = users.findIndex(user => user.name === name);
  if (userIndex !== -1) {
    // User exists
    const user = users[userIndex];
    if (taskIndex >= 0 && taskIndex < user.todos.length) {
      // Delete the task at the specified index
      user.todos.splice(taskIndex, 1);
      res.send('Task deleted');
    } else {
      // Invalid task index
      res.status(400).send('Invalid task index');
    }
  } else {
    // User not found
    res.status(404).send('User not found');
  }
});



module.exports = router;
