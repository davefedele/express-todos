var express = require('express');
var app = express();

var bodyparser = require('body-parser');
var urlencode = bodyparser.urlencoded({ extended: false });

app.use(express.static('public'));

// Redis Connection
var redis = require('redis');
if( process.env.REDISTOGO_URL ){
  var rtg = require('url').parse(process.env.REDISTOGO_URL);
  var client = redis.createClient(rtg.port, rtg.hostname);
  client.auth(rtg.auth.splut(":")[1]);
}else{
  var client = redis.createClient();
}

client.select((process.env.NODE_ENV || 'development').length);
// End Redis Connection

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