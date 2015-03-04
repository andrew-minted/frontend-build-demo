var Backbone = require('backbone');
var Todo = require('./Todo.model');

var Todos = Backbone.Collection.extend({
  model: Todo
});

module.exports = Todos;