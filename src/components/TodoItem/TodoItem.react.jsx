// Copyright (C) 2015 Minted Inc.
// All Rights Reserved

'use strict';

var React = require('react');

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
