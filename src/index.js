const express = require('express');
const cors = require('cors');

 const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

 const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const {username} = request.headers;

  const user = users.find(user => user.username === username);

  if(!user)
    return response.status(404).json({error: "User not exists"})

  request.user = user
  return next()
}

app.post('/users', (request, response) => {
  // Complete aqui
  const {name, username} = request.body;

  const userExists = users.find(user => user.username === username);

  if(userExists){
    return response.status(400).json({error: "User alredy exists"})
  }

  const newUser = {
    id: uuidv4(),
    name: name,
    username: username,
    todos: []
  }

  users.push(newUser)

  return response.status(201).json(newUser)

});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;

  return response.json(user.todos)

});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {user} = request
  const{title, deadline} = request.body



  const todo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  }

  user.todos.push(todo)

  return response.status(201).json(todo);

});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui"
  const {user} = request
  const{title, deadline} = request.body
  const {id } = request.params

  const todo = user.todos.find(todo => todo.id === id)

  if(!todo)
    return response.status(404).json({error: "Todo Not Found"})

  todo.title = title
  todo.deadline = new Date(deadline)

  return response.status(201).json(todo)

});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {user} = request
  const {id } = request.params

  const todo = user.todos.find(todo => todo.id === id)

  if(!todo)
  return response.status(404).json({error: "Todo Not Found"})

  todo.done = true

  return response.status(201).json(todo)
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {user} = request
  const {id } = request.params

  const todoIndex = user.todos.findIndex(todo => todo.id === id)

  if(todoIndex === -1)
    return response.status(404).json({error: "Todo not found"})

  user.todos.splice(todoIndex, 1)

  return response.status(204).json()
});

module.exports = app;