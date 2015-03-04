var Todo = require('./Todo.model');

describe('Todo Model', function(){
  var todo;

  beforeEach(function(){
    todo = new Todo({text: 'test todo'});
  });

  it('\'toggleCompletedState\' method should toggle \'completed\' attribute from true to false', function(){
    expect(todo.get('completed')).to.equal(false);
    todo.toggleCompletedState();
    expect(todo.get('completed')).to.equal(true);
  });

  it('\'toggleCompletedState\' method should toggle \'completed\' attribute from false to true', function(){
    todo.set({'completed': true});
    expect(todo.get('completed')).to.equal(true);
    todo.toggleCompletedState();
    expect(todo.get('completed')).to.equal(false);
  });
});