// Copyright (C) 2015 Minted Inc.
// All Rights Reserved

'use strict';

var Backbone = require('backbone');
var sinon = require('sinon');
var proxyquire = require('proxyquire').noCallThru();
var React = require('react/addons');
var TestUtils = React.addons.TestUtils;

describe('TodoItem Component', function() {
  // Define variables that we will be re-using in unit tests
  var Todo;
  var todo;
  var TodoItem;
  var todoItem;
  var span;
  var checkbox;
  var spiedClickHandler;

  before(function(){
    // define mocks
    Todo = Backbone.Model.extend({
      defaults: {
        text: 'test model',
        completed: false
      },
      toggleCompletedState: function(){
        return null;
      }
    });

    // Require module that we're testing
    // override its dependencies with mocks
    TodoItem = proxyquire('./TodoItem.react.jsx', {});
  });

  beforeEach(function(){
    // create new model instance
    todo = new Todo();

    // Spy on model method so we can see if its called
    spiedClickHandler = sinon.spy(todo, 'toggleCompletedState');

    // Render the App Component into the DOM
    todoItem = TestUtils.renderIntoDocument(
      <TodoItem todo={todo} />
    );

    // Create reference to dom nodes we will be testing
    span = TestUtils.findRenderedDOMComponentWithTag(todoItem, 'span');
    checkbox = TestUtils.findRenderedDOMComponentWithTag(todoItem, 'input');
  });

  it("renders the model's 'text' attribute correctly", function() {
    expect(span.getDOMNode().textContent).to.equal('test model');
  });

  it("calls the model's 'toggleCompletedState' method when checkbox value is changed", function() {
    expect(spiedClickHandler.called).to.equal(false);
    React.addons.TestUtils.Simulate.change(checkbox);
    expect(spiedClickHandler.calledOnce).to.equal(true);
  });
});


