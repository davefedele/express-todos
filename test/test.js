var request = require('supertest');
var app = require('./../app');

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
      .expect(JSON.stringify(['Laundry', 'Write ES7', 'Grocery Shopping']), done);
  });

});
