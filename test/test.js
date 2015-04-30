var request = require('supertest');
var app = require('./../app');

var redis = require('redis');
var client = redis.createClient();
client.select('test'.length);
client.flushdb();

describe('Requests to the root path', function(){
  
  it('Returns a 200 status code', function(done){
    request(app)
      .get('/')
      .expect(200, done);
  });

  it('Returns HTML format', function(done){
    request(app)
      .get('/')
      .expect('Content-Type', /html/, done);
  });

  it('Returns an index file with todos', function(done){
    request(app)
      .get('/')
      .expect(/todos/i, done);
  });

});

describe('Listing todos on /todos', function(){
  
  it('Returns a 200 status code', function(done){
    request(app)
      .get('/todos')
      .expect(200, done);
  });

  it('Returns JSON format', function(done){
    request(app)
      .get('/todos')
      .expect('Content-Type', /json/, done);
  });

  it('Returns initial todos', function(done){
    request(app)
      .get('/todos')
      .expect(JSON.stringify([]), done);
  });

});

describe('Creating new todos', function () {
  
  it('Returns a 201 status code', function (done) {
    request(app)
      .post('/todos')
      .send('todo=Brush+Teeth&description=clean+them+well')
      .expect(201, done);
  });

  it('Returns the todo', function (done) {
    request(app)
      .post('/todos')
      .send('todo=Brush+Teeth&description=clean+them+well')
      .expect(/Brush/i, done);
  });

  it('Validates todo and description', function (done) {
    request(app)
      .post('/todos')
      .send('name=&description=')
      .expect(400, done);
  });

});

describe('Deleting todos', function () {

  before(function(){
    client.hset('todos', 'Golf', 'Play 9 holes');
  });

  after(function(){
    client.flushdb();
  });

  it('Returns a 204 status code', function (done) {
    request(app)
      .delete('/todos/Golf')
      .expect(204, done);
  });
  
});