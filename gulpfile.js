// Copyright (C) 2015 Minted Inc.
// All Rights Reserved

'use strict';

var gulp          = require('gulp');
var gutil         = require('gulp-util');
var connect       = require('gulp-connect');
var runSequence   = require('run-sequence');
var webpack       = require('webpack');
var webpackConfig = require('./webpack.config');
var eslint        = require('gulp-eslint');
var jsxcoverage   = require('gulp-jsx-coverage');
var open          = require('gulp-open');
var testdom       = require('testdom');
var testcop       = require('test-cop');


var paths = {
  tests: ['src/**/*.tests.js', 'src/**/*.tests.jsx'],
  js: ['src/**/*.js', 'src/**/*.jsx'],
  html: ['./index.html'],
  sass: ['src/**/*.scss']
};


/* COMMANDS FOR DEVELOPERS
* 'develop': spin up dev server, open browser, watch JS/JSX/SCSS source files for changes,
*            build bundles with source maps, and live reload browser on changes
* 'build': TODO - add uglified node_env = 'production' webpack build task (see here: https://github.com/webpack/webpack-with-common-libs/blob/master/gulpfile.js)
* 'lint': run code linting
* 'unittests': run unit tests and code coverage
* 'test': run linting AND unit tests with code coverage
* 'report': open unit test coverage report in browser
*/


// Start Development Server (w/ LiveReloading)
// Accessible at http://localhost:5000
// ===========================================
gulp.task('serve:dev', function() {
  connect.server({
    port: 5000,
    livereload: true
  });
});


// Open Development URL in Browser (w/ LiveReloading)
// ===========================================
gulp.task('open-url:dev', function(){
  var options = {
    url: 'http://localhost:5000'
  };
  gulp.src('./index.html')
  // A file must be specified as the src when running
  // options.url or gulp will overlook the task.
  .pipe(open('', options));
});


// Watch HTML source files for changes
// and trigger browser reload
// ==================================
gulp.task('watch-html', function () {
  gulp.watch(paths.html, function(){
    gulp.src(paths.html)
    .pipe(connect.reload());
    gutil.log('[watcher: HTML]', ' Reloaded New HTML Assets in Browser');
  });
});


// Watch SASS source files for changes
// and trigger browser reload
// ==================================
gulp.task('watch-sass', function () {
  gulp.watch(paths.html, function(){
    gulp.src(paths.html)
    .pipe(connect.reload());
    gutil.log('[watcher: HTML]', ' Reloaded New HTML Assets in Browser');
  });
});

// Build Client JS Bundle (Development)
// Watches for file changes
// Triggers live-reload (via gulp-connect)
// ====================================
gulp.task('watch-and-build-js:dev', function() {
  // Bundle the static assets
  webpack(webpackConfig, function(err, stats) {
    if (err) {
      throw new gutil.PluginError('webpack', err);
    }

    // show output only on errors
    if (stats.hasErrors()) {
      gutil.log('[webpack]', stats.toString({colors: true}));
    }

    gutil.log('[webpack]', ' Built JS Bundle');
    gulp.src('./build/bundle.js')
      .pipe(connect.reload());
    gutil.log('[watcher: JS]', ' Reloaded New JS Bundle in Browser');
  });
});

gulp.task('watch-and-build-styles:dev', ['watch-and-build-js:dev']);

// For live reload to work, the connect server and the
// reload command must be run by the same process
gulp.task('develop', ['serve:dev', 'watch-html', 'watch-and-build-js:dev', 'open-url:dev']);



// Build Uglified JS Bundle for Deployment
// no sourcemaps
// ====================================



// Run Linting with ESLint
// ==================================
gulp.task('lint', function () {
  // Note: To have the process exit with an error code (1) on
  //  lint error, return the stream and pipe to failOnError last.
  return gulp.src(['./src/**/*.{js,jsx}'])
    .pipe(eslint())
    .pipe(eslint.format());
});


// Run Unit Tests (w/ Code Coverage)
// =================================
gulp.task('unittests', function() {
  // Run scripts before tests
  // This is a good place to insert globals for test running, if necessary

  // Create a fake global `window` and `document` object if 'document' doesn't exist
  testdom('<html><body><div id="todo-app"></div></body></html>');

  // Make Chai available for all unit tests
  global.expect = require('chai').expect;

  // Run testcop to generate unit test scaffold for source files missing unit tests
  testcop('./src/**/*.{js,jsx}', '.tests');

  (jsxcoverage.createTask({
    src: ['src/**/*.tests.{jsx,js}'],                              // will pass to gulp.src
    istanbul: {                                                    // will pass to istanbul
        coverageVariable: '__MY_TEST_COVERAGE__',
        exclude: /node_modules|\.tests\.(js|jsx)|\/test-helpers|app.jsx/
    },
    transpile: {
        babel: {
            include: /\.jsx|\.js$/,
            exclude: /node_modules/
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
    }
  }))().on('error', console.log.bind(console));
});

// Run Linter, then Unit Tests (w/ Code Coverage)
// ==============================================
gulp.task('test', function(callback){
  runSequence('lint', 'unittests', callback);
});


// Open Coverage HTML Report in Browser
// ==================================
gulp.task('report', function(){
  gulp.src('./coverage/lcov-report/index.html')
  .pipe(open('<%file.path%>'));
});


gulp.task('default', ['develop']);
