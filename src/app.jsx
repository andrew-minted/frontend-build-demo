var React = require('react');

var TodoApp = require('./components/TodoApp/TodoApp.react.jsx');
var Todos = require('./models/Todos.collection');

var todos = new Todos([
  { text: "Create a React todo list", completed: false},
  { text: "Create an Angular todo list", completed: false},
  { text: "Demo how unit testing in react works", completed: false}
]);

// Render Todo Application 
React.render(<TodoApp todos={todos} />, document.getElementById('todo-app'));