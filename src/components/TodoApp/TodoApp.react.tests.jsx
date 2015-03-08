// Copyright (C) 2015 Minted Inc.
// All Rights Reserved

"use strict";

var React = require('react/addons');
var TestUtils = React.addons.TestUtils;
var sinon = require('sinon');
var proxyquire = require('proxyquire').noCallThru();

describe('TodoApp Component', function() {
  // Define variables that we will be using in unit tests
  var mockComponent;
  var mockMixin;
  var TodoApp;
  var todoApp;
  var Todos;
  var todos;
  var h3;
  var spy;

  before(function(){
    // define mocks
    mockComponent = React.createClass({render:function(){return null;}});
    mockMixin = {};

    // require module to unit test and
    // override its dependencies with mocks
    TodoApp = proxyquire('./TodoApp.react.jsx', {
      '../TodoItem/TodoItem.react.jsx': mockComponent,
      '../AddTodo/AddTodo.react.jsx': mockComponent,
      '../../mixins/BackboneMixin': mockMixin
    });

    // Require Todos collection
    // TODO: replace this with a mock that doesn't require the
    // file, in order to prevent Istnabul over-reporting code-coverage
    Todos = proxyquire('../../models/Todos.collection', {});
  });

  beforeEach(function(){
    todos = new Todos([
      {text: 'test task 1', completed: false},
      {text: 'test task 2', completed: true}
    ]);

    // Render the App Component into the DOM
    todoApp = TestUtils.renderIntoDocument(
      <TodoApp todos={todos} />
    );

    // Create reference to h3 whose output we will be testing
    h3 = TestUtils.findRenderedDOMComponentWithTag(todoApp, 'h3');
  });

  it('renders the todo list title text correctly', function() {
    expect(h3.getDOMNode().textContent).to.equal('Todo List');
  });

  describe('addNewTodo method', function(){
    it('adds a new item to the collection correctly', function() {
      spy = sinon.spy(todos, 'add');
      // expect(h3.getDOMNode().textContent).to.equal('Todo List');
    });
  });
});