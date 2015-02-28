var recursiveSearch = require('recursive-readdir');
var path = require('path');

var sourceDir = 'js';
recursiveSearch(__dirname + '/../' + sourceDir, ['bundle.js', '*.css', '*.sass', '*.html'], function(err, files) {
  if (err) { throw err; }

  var allFiles = {};
  var sourceFiles = [];

  files.forEach(function(filepath) {
    var shorterFilePath = filepath.split('/' + sourceDir + '/')[1]; //replace with regex
    if (!filepath.match(/\.tests\./)) {
      sourceFiles.push(shorterFilePath);
    }
    allFiles[shorterFilePath] = true;
  });

  console.log('All Files: ', allFiles);

  var filesMissingTests = sourceFiles.filter(function(filepath){
    // if filepath with extension replaced with tests.extension isn't inside of allFiles hash

    // Replace all this with Regex
    var dirname = (path.dirname(filepath) === '.') ? '' : path.dirname(filepath) + '/';
    var extension = path.extname(filepath);
    var pathWithoutExt = path.basename(filepath, extension);
    var testFile = dirname + pathWithoutExt + '.tests' + extension;

    return !allFiles[testFile];
  });

  console.log('Files missing unit tests:');
  filesMissingTests.forEach(function(file){
    console.log('   ' + file);
  });

  // return console.log('Files missing tests: ', filesMissingTests);
});