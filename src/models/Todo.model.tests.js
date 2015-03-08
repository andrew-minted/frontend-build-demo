// Copyright (C) 2015 Minted Inc.
// All Rights Reserved

"use strict";

var proxyquire = require('proxyquire').noCallThru();

describe('Todo Model', function(){
  // Define variables that we will be using in unit tests
  var Todo;
  var todo;

  before(() => {
    //Require module that we're testing
    Todo = proxyquire('./Todo.model', {});
  });

  beforeEach(function(){
    todo = new Todo({text: 'test todo'});
  });

  it("toggleCompletedState' method should toggle 'completed' attribute from true to false", function(){
    expect(todo.get('completed')).to.equal(false);
    todo.toggleCompletedState();
    expect(todo.get('completed')).to.equal(true);
  });

  it("toggleCompletedState' method should toggle 'completed' attribute from false to true", function(){
    todo.set({'completed': true});
    expect(todo.get('completed')).to.equal(true);
    todo.toggleCompletedState();
    expect(todo.get('completed')).to.equal(false);
  });
});