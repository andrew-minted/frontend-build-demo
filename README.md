Demo of React+Backbone+Browserify+Mocha+JSDOM+Istanbul+JSX+ES6
==================

### Getting Started:
```
# Install dependencies
npm install

# Install gulp globally (if you don't already have it)
npm install -g gulp


# spin up dev server, watch HTML/SASS/JS/JSX source files for changes,
# build bundles with source maps, and opens browser (w/live reloading)
gulp develop

# cleans existing build bundles, builds optimized css and jss
# without sourcemaps, uglified, using all webpack # optimizations
gulp build

# delete all files in './build'
gulp clean

# run code linting (rules defined in .eslintrc)
gulp lint

# run unit tests and code coverage    
gulp unittests

# run linting AND unit tests with code coverage
gulp test

# open unit test coverage report in browser     
gulp report
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

  - SASS compiling currently only works for an entry file that
    imports all the .scss files. The current setup works like this:

    html --> links to build/styles.css --> built from styles.scss, which links to all src/**/*.scss files and is recompiled on any changes to those source scss files.

  - TODO: auto-import (or use some other mechanism) .scss files so developers don't have to manually @import it in the entry-point 'styles.scss' file.


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



