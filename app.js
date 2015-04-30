var express = require('express');
var app = express();

var bodyparser = require('body-parser');
var urlencode = bodyparser.urlencoded({ extended: false });

app.use(express.static('public'));

var redis = require('redis');
var client = redis.createClient();

client.select((process.env.NODE_ENV || 'development').length);

// client.hset('todos', 'Laundry', 'wash clothes and sheets too');
// client.hset('todos', 'Workoug', 'run plus pushups/pullups');
// client.hset('todos', 'Grocery Shopping', 'bagels, yogurt, bananas');
// client.flushdb()

app.get('/todos', function( request, response ){
  client.hkeys('todos', function( error, todos){
    if( error ) throw error;
    response.json(todos);
  });
});

app.post('/todos', urlencode, function( request, response ){
  var newTodo = request.body;
  
  client.hset('todos', newTodo.todo, newTodo.description, function( error ){
    if( error ) throw error;
    response.status(201).json(newTodo.todo);
  });
  
});

module.exports = app;