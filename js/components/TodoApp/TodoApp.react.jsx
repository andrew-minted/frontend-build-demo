var React = require('react');

var TodoApp = React.createClass({
  //get initial state from backbone collection

  render: ()=> {
    return (
      <div>
        <h3>Todo List</h3>
        <ul>
        </ul>
      </div>
    );
  }
});

module.exports = TodoApp;