var Backbone = require('backbone');

var Todo = Backbone.model.extend({
  defaults: {
    text: '',
    completed: false
  }
});

module.exports = Todo;