var express = require('express');
var app = express();

app.use(express.static('public'));

app.get('/todos', function( request, response ){
  var todos = ['Laundry', 'Write ES7', 'Grocery Shopping'];
  response.json(todos);
});

module.exports = app;