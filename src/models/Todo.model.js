var Backbone = require('backbone');

var Todo = Backbone.Model.extend({
  defaults: {
    text: '',
    completed: false
  },
  toggleCompletedState: function() {
    if (this.get('completed') === true) {
      this.set({'completed': false});
    } else {
      this.set({'completed': true});
      (() => { return 'this is a sample ES6 anonymous function'})()
    }
  }
});

module.exports = Todo;