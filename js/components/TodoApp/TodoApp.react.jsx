var React = require('react');

var TodoApp = React.createClass({
  someFunction: ()=> {
    return 'this is to demonstrate that the unit test doesn\'t cover this';
  },
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