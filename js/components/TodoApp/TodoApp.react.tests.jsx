var expect = require('chai').expect;

// Create a fake global `window` and `document` object:
// Note: This must be required before React
require('../../../test-helpers/testdom')('<html><body></body></html>');

var React = require('react/addons');
var TestUtils = React.addons.TestUtils;

describe('TodoApp Component', ()=> {
  // Require React Component that we will be testing
  var TodoApp = require('./TodoApp.react.jsx');

  // Define variables that we will be re-using in unit tests
  var todoApp;
  var h3;

  beforeEach(function(){

    // Render the App Component into the DOM
    todoApp = TestUtils.renderIntoDocument(
      <TodoApp />
    );

    // Create reference to div whose output we will be testing
    h3 = TestUtils.findRenderedDOMComponentWithTag(todoApp, 'h3');
  });

  it('renders the hello world text correctly', function() {
    expect(h3.getDOMNode().textContent).to.equal('Todo List');
  });
});