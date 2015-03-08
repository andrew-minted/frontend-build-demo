// Copyright (C) 2015 Minted Inc.
// All Rights Reserved

'use strict';

var React = require('react');

var BackboneMixin = require('../../mixins/BackboneMixin');
var TodoItem = require('../TodoItem/TodoItem.react.jsx');
var AddTodo = require('../AddTodo/AddTodo.react.jsx');

var TodoApp = React.createClass({
  mixins: [BackboneMixin],

  someFunction: () => {
    return 'this is to demonstrate that the unit test doesn\'t cover this';
  },

  // Get backbone models from collection.
  // This method is required for the Backbone Mixin to function correctly
  getBackboneCollection: function() {
    return this.props.todos;
  },

  addNewTodo: function(objForNewModel){
    this.props.todos.add(objForNewModel);
  },

  render: function() {
    // define map of backbone models in collection as children components
    var todoItemComponents = this.props.todos.map(function(todo, index){
      return (<TodoItem key={index} idx={index} todo={todo} />);
    });
    return (
      <div>
        <h3>Todo List</h3>
        <AddTodo handleSubmit={this.addNewTodo}/>
        <ul>
          {todoItemComponents}
        </ul>
      </div>
    );
  }
});

module.exports = TodoApp;
