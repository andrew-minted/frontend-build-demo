// Copyright (C) 2015 Minted Inc.
// All Rights Reserved

"use strict";

var proxyquire = require('proxyquire').noCallThru();

describe('AddTodo Component', function(){
  var module

  before(function(){
    module = proxyquire('./AddTodo.react.jsx', {});
  });

  it('should exist', function(){
    expect(true).to.not.equal(false);
  });
});