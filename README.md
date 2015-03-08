Demo of React+Backbone+Browserify+Mocha+JSDOM+Istanbul+JSX+ES6
==================

### Getting Started:
```
# Install dependencies
npm install

# Install gulp globally (if you don't already have it)
npm install -g gulp

# Start Build Process (watches for file changes)
gulp develop

# (In a new tab), open the app
open .

# Run Tests (this will run the linter, mocha, code coverage, and checkForUnitTests script)
gulp test
```


### Linting Guide
To get Sublime Text linting that adheres to the .eslintrc settings per project, follow this excellent guide:
https://medium.com/@dan_abramov/lint-like-it-s-2015-6987d44c5b48

Doing so will save you a lot of trouble because you'll catch syntax errors and style deviations faster than running the 
linting task.


###Organization Conventions:

JSX files end in .jsx

React components should be put in their own folder (TitleCased), which will contain the component jsx file, the unit tests for it, and the css styling (or Stylus css template).

React component filenames are TitleCased, and appended with component.jsx, eg:
  InputBox.react.jsx

Unit tests mirror the filename of the unit they are testing, put add the .tests.<ext> suffix. eg:
  InputBox.react.tests.jsx

Unit tests should be placed adjacent to the unit they are testing

All .js and .jsx files can freely use ES6 features, including the unit tests.


###Limitations:

  - coverage statistics will only be gathered for files that are imported by *.tests.{js,jsx} files. This means that if you haven't written a unit test *file*, then the file that should be tested will not be reported in the coverage statistics.
  This means it is crucial to always double check that a new js/jsx file is accompanied by a corresponding test file.

  - the test-helpers/checkForUnitTests.js script will run after all the tests and report (via the terminal) any files that are missing an accompanying '*.tests.{js,jsx}' file.

  - Make sure your unit test file requires the module you are testing, otherwise both istanbul AND the checkForUnitTests script will not flag the module as being untested. (TODO: upgrade the checkForUnitTests.js script to verify that the *.tests.{js,jsx} file requires the module it's supposed to test)


###Unit Testing:
  JSDom's virtual dom and Chai's Expect are available globally to all tests before running. This may
  have performance implications for non-react component unit tests, but it substantially reduces the boilerplate burden of
  a developer writing unit tests. It's better for the unit tests to take a bit longer to run because of unused libraries loaded
  (only for that one testing runtime) than to discourage developers from unit testing.

###Linting:
  .jshintrc file has configuration


### Test Writing

#### Requiring Global libraries / tools
Because node caches CJS modules, the tests will run faster if you import global libraries and tools (like React, Backbone, sinon, proxyquire, etc.) *outside* of the unit tests' describe blocks.

#### Requiring 1st party modules / code to test
In order to namespace the tests effectively and prevent errors from occuring due to Node's CJS caching, it is important that in your test files, you only require 1st party modules using proxyquire. This should be done in the 'before' block.

If you have no dependencies, then it should pass an empty object as the second argument:
``` 
var myModule = proxyquire('./path/to/myModule', {})
```

If you have dependencies to mock, pass them in as arguments, like so:
``` 
var myModule = proxyquire('./path/to/myModule', {
  './path/to/dependency': myMock
});
```

*Note* Requiring 1st party modules can mess up code coverage reporting. Istanbul measures coverage by checking which functions are called by files required by unit tests. By requiring a 1st party module in a unit test from some other module, istanbul may over-report coverage if its functions are called. As a result, it's always advisable to mock (without requiring) instead of requiring other 1st party modules whenever possible.

#### Unit Test Scoping Rules of Thumb

#####GLOBAL SCOPE
- Require global modules and libraries in the global scope
- Don't put anything else here

#####DESCRIBE BLOCK
- Declare all variables that will be used and reused in tests
- Do not put any other code here, because Mocha's error handle will not bubble up and will crash the test process.

#####HOOKS (Before, BeforeEach, After, AfterEach)
- Anything/everything that changes the state of objects used in testing
- Create mocks
- Require all 1st party modules (only using proxyquire in order to bypass Node's CJS cache, even if not mocking)

More information on Mocha scoping: http://stackoverflow.com/questions/21470349/variable-in-outer-describe-block-is-undefined-when-accessing-in-inner-describe-b



