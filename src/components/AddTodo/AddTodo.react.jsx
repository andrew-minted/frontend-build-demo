// Copyright (C) 2015 Minted Inc.
// All Rights Reserved

"use strict";

var React = require('react');

var AddTodo = React.createClass({
  getInitialState: function(){
    return { inputText: ''};
  },

  handleInputChange: function(e){
    var newText = e.target.value;
    this.setState({inputText: newText});
  },

  handleSubmit: function(){
    this.props.handleSubmit({text: this.state.inputText});
    this.setState(this.getInitialState());
  },

  render: function(){
    return (
     <h4>
       <p>Add a new todo</p>
       <input type='text' 
         onChange={this.handleInputChange}
         value={this.state.inputText}
       />
       <a href='#' onClick={this.handleSubmit}>Submit</a>
     </h4>
   );
  }
});

module.exports = AddTodo;