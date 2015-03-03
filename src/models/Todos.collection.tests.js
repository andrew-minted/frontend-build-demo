var Backbone = require('backbone');
var proxyquire = require('proxyquire').noCallThru();

// define mock dependency
var mockTodo = new Backbone.Model.extend({
  defaults: {}
});

// override the modules dependencies with mocks
var Todos = proxyquire('./Todos.collection', {
  './Todo.model': mockTodo
});

describe('Todos collection', function() {
  var todos = new Todos();

  it("doesn't require unit tests because it only uses backbone defaults", function() {
    expect(todos instanceof Backbone.Collection).to.equal(true);
  });
});