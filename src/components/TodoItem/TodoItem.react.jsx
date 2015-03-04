var React = require('react');
// var AppActions = require('../actions/AppActions.js');

var TodoItem = React.createClass({
  handleCheckboxChange: function() {
    this.props.todo.toggleCompletedState();
  },
  render: function() {
    return (
      <li>
        <span>    
          <input 
            onChange={this.handleCheckboxChange} 
            type='checkbox' checked={this.props.todo.get('completed')}
          />
          {this.props.todo.get('text')}  
        </span>
      </li>
    );
  }
});

module.exports = TodoItem;