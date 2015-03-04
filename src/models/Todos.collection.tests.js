var Backbone = require('backbone');
var proxyquire = require('proxyquire').noCallThru();

describe('Todos Collection', function() {
  // Define variables that we will be using in unit tests
  var mockTodo;
  var Todos;
  var todos;

  before(function(){
    // define mocks
    mockTodo = new Backbone.Model.extend({});

    // Require module that we're testing
    // override the modules dependencies with mocks
    Todos = proxyquire('./Todos.collection', {
      './Todo.model': mockTodo
    });

    todos = new Todos();
  });

  it("doesn't require unit tests because it only uses backbone defaults", function() {
    expect(todos instanceof Backbone.Collection).to.equal(true);
  });
});