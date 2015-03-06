var gulp         = require('gulp');
var browserify   = require('browserify');
var babelify     = require('babelify');
var watchify     = require('watchify');
var livereload   = require('gulp-livereload');
var streamify    = require('gulp-streamify');
var util         = require('gulp-util');
var source       = require('vinyl-source-stream'); // Used to stream bundle for further handling
var uglify       = require('gulp-uglify');
var babel        = require('gulp-babel');
var jshint       = require('gulp-jshint');
var stylish      = require('jshint-stylish');
var jsx_coverage = require('gulp-jsx-coverage');
var open         = require('gulp-open');

var testdom      = require('./test-helpers/testdom');
var checkForUnitTests = require('./test-helpers/checkForUnitTests');


// Watch & Build Client JS Bundle
// with source maps for debugging
// ====================================
gulp.task('develop', function() {
  livereload.listen();
  babelify.configure({ // Babelify transforms .es6, .es, .js, and .jsx to ES5
    sourceMapRelative: './src/' // Gives us sourcemapping from transpiled to ES5 files
  });

  var bundler = browserify({
    entries: ['./src/app.jsx'], // Only need initial file, browserify finds the deps
    transform: [babelify],
    debug: true, // Gives us sourcemapping
    cache: {}, packageCache: {}, fullPaths: true // Requirement of watchify
  });

  var watcher  = watchify(bundler);

  return watcher
  .on('update', function () { // When any files update
    var updateStart = Date.now();
    console.log('Updating!');
    watcher.bundle()
    .on('error', function(error){
      util.log('Error', error);
      this.end();
    }) // Create new bundle that uses the cache for high performance
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('./src/build/'));
    console.log('Updated!', (Date.now() - updateStart) + 'ms');
  })
  .bundle() // Create the initial bundle when starting the task
  .pipe(source('bundle.js'))
  .pipe(gulp.dest('./src/build/'))
  .pipe(livereload());
});


// Build Uglified JS Bundle for Deployment
// no sourcemaps
// ====================================
gulp.task('build', function() {
  return browserify({
    entries: ['./src/app.jsx'], // Only need initial file, browserify finds the deps
    transform: [babelify]
  })
  .bundle()
  .on('error', function(error){
    util.log('Bundle Error', error);
    this.end();
  })
  .pipe(source('bundle.js')) // gives streaming vinyl file object
  .pipe(streamify(uglify()))
  .pipe(gulp.dest('./src/build/'));
});

// Run Linting with JSHint
// ==================================
gulp.task('lint', function () {
  gulp.src(['./src/**/!(build)/*.{js,jsx}'])
    .pipe(babel())
    .on('error', console.log.bind(console))
    .pipe(jshint())
    .pipe(jshint.reporter( stylish ));
});


// Run Unit Tests with Coverage
// ==================================
gulp.task('cover-and-test', function() {
  // Attach boilerplate test utilities before running tests
  // ##########

  // Create a fake global `window` and `document` object if 'document' doesn't exist
  testdom('<html><body></body></html>');

  // Make Chai available for all unit tests
  global.expect = require('chai').expect;

  // ##########

  (jsx_coverage.createTask({
    src: ['src/**/*.tests.{jsx,js}'],                              // will pass to gulp.src
    istanbul: {                                                    // will pass to istanbul
        coverageVariable: '__MY_TEST_COVERAGE__',
        exclude: /node_modules|\.tests\.(js|jsx)|\/test-helpers|app.jsx/,
    },
    transpile: {
        babel: {
            include: /\.jsx|\.js$/,
            exclude: /node_modules/
        },
        coffee: {
            include: /\.coffee$/
        }
    },
    coverage: {
      reporters: ['text', 'text-summary', 'json', 'lcov'],        // list of istanbul reporters
      directory: 'coverage'                                       // will pass to istanbul reporters
    },
    mocha: {                                                      // will pass to mocha
      reporter: 'spec'
    },
    babel: {                                                      // will pass to babel
      sourceMap: 'inline'                                         // get hints in HTML covarage reports
    },

    //optional tasks to be run after test is done
    cleanup: function () {
      // EX: clean global.window when test with jsdom
      
      // Check files not covered by istanbul* for unit tests
      // * Istanbul will only report coverage for source files that are
      // required by the the test files it executes. This script will
      // report which files are missing accompanying .tests.{js,jsx} files
      // first argument is src directory, second argument is array of globs
      // to ignore
      checkForUnitTests('src', ['app.jsx', 'bundle.js', '*.css', '*.scss', '*.html']);
    }
  }))()
  .on('error', console.log.bind(console));
});


// Run Linting, Tests, and Code Coverage
// ==================================
gulp.task('test', ['lint', 'cover-and-test']);


// Open Coverage HTML Report in Browser
// ==================================
gulp.task('report', function(){
  gulp.src('./coverage/lcov-report/index.html')
  .pipe(open('<%file.path%>'));
});

gulp.task('default', ['develop']);
