// Copyright (C) 2015 Minted Inc.
// All Rights Reserved

'use strict';

var Backbone = require('backbone');
var Todo = require('./Todo.model');

var Todos = Backbone.Collection.extend({
  model: Todo
});

module.exports = Todos;
