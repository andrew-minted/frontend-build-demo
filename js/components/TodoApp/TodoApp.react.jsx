var React = require('react');

var TodoApp = React.createClass({
  someFunction: ()=> {
    return 'this is to demonstrate that the unit test doesn\'t cover this';
  },
  // add backbone mixin for boilerplate event listening / binding functionality
  // http://stackoverflow.com/questions/20371566/handling-backbone-model-collection-changes-in-react-js
  // https://github.com/facebook/react/blob/1be9a9e/examples/todomvc-backbone/js/app.js#L148-L171
  // https://www.npmjs.com/package/react.backbone

  // get initial state from backbone collection

  // define map of backbone models in collection as children components

  render: ()=> {
    return (
      <div>
        <h3>Hello World!</h3>
        <ul>
        </ul>
      </div>
    );
  }
});

module.exports = TodoApp;