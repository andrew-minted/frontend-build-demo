var Backbone = require('backbone');
var Todo = require('Todo.model');

var TodoList = Backbone.Collection.extend({
  model: Todo
});

module.exports = TodoList;