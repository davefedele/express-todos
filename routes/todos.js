var express = require('express');

var bodyparser = require('body-parser');
var urlencode = bodyparser.urlencoded({ extended: false });

// Redis Connection
var redis = require('redis');
if( process.env.REDISTOGO_URL ){
  var rtg = require('url').parse(process.env.REDISTOGO_URL);
  var client = redis.createClient(rtg.port, rtg.hostname);
  client.auth(rtg.auth.split(":")[1]);
}else{
  var client = redis.createClient();
  client.select((process.env.NODE_ENV || 'development').length);
}
// End Redis Connection

// client.hset('todos', 'Laundry', 'wash clothes and sheets too');
// client.hset('todos', 'Workoug', 'run plus pushups/pullups');
// client.hset('todos', 'Grocery Shopping', 'bagels, yogurt, bananas');
// client.flushdb()


var router = express.Router();

router.route('/')
  .get(function( request, response ){
    client.hkeys('todos', function( error, todos){
      if( error ) throw error;
      response.json(todos);
    });
  })
  .post(urlencode, function( request, response ){
    var newTodo = request.body;
    if(!newTodo.todo || !newTodo.description){
      response.sendStatus(400); 
    }
    client.hset('todos', newTodo.todo, newTodo.description, function( error ){
      if( error ) throw error;
      response.status(201).json(newTodo.todo);
    });    
  });

router.route('/:todo')
  .get(function( request, response ){
    client.hget('todos', request.params.todo, function( error, description ){
      if( error ) throw error;
      response.render('show.ejs', 
        {
          todo: 
          { todo: request.params.todo, description: description }
      });
    });
  })
  .delete(function( request, response) {
    client.hdel('todos', request.params.todo, function(error){
      if( error ) throw error;
      response.sendStatus(204);
    });
  });

module.exports = router;
