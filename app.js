var express = require('express');
var app = express();

var bodyparser = require('body-parser');
var urlencode = bodyparser.urlencoded({ extended: false });

app.use(express.static('public'));

var todos = {
  'Laundry': 'wash sheets too', 
  'Write ES7' : 'make sure it\'s functional', 
  'Grocery Shopping' : 'bagels, yogurt, bananas' 
  };

app.get('/todos', function( request, response ){
  response.json(Object.keys(todos));
});

app.post('/todos', urlencode, function( request, response ){
  var newTodo = request.body;
  console.log(newTodo);
  todos[newTodo.todo] = newTodo.description;
  response.status(201).json(newTodo.todo);
});

module.exports = app;