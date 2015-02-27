Organization Conventions:

JSX files end in .jsx

React components should be put in their own folder (TitleCased), which will contain the component jsx file, the unit tests for it, and the css styling (or Stylus css template).

React component filenames are TitleCased, and appended with component.jsx, eg:
  InputBox.react.jsx

Unit tests mirror the filename of the unit they are testing, put add the .tests.<ext> suffix. eg:
  InputBox.react.tests.jsx

Unit tests should be placed adjacent to the unit they are testing

All .js and .jsx files can freely use ES6 features, including the unit tests.


Limitations:

  - coverage statistics will only be gathered for files that are imported by *.tests.{js,jsx} files. This means that if you haven't written a unit test *file*, then the file that should be tested will not be reported in the coverage statistics.
  This means it is crucial to always double check that a new js/jsx file is accompanied by a corresponding test file