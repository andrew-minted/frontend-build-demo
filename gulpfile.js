// Copyright (C) 2015 Minted Inc.
// All Rights Reserved

'use strict';

var gulp          = require('gulp');
var gutil         = require('gulp-util');
var clean         = require('gulp-clean');
var connect       = require('gulp-connect');
var sass          = require('gulp-sass');
var sourcemaps    = require('gulp-sourcemaps');
var runSequence   = require('run-sequence');
var webpack       = require('webpack');
var webpackConfig = require('./webpack.config');
var eslint        = require('gulp-eslint');
var jsxcoverage   = require('gulp-jsx-coverage');
var open          = require('gulp-open');
var testdom       = require('testdom');
var testcop       = require('test-cop');


var paths = {
  tests: ['src/**/*.tests.{js,jsx}'],
  js: ['src/**/*.{js,jsx}'],
  html: ['./index.html'],
  sass: ['src/**/*.scss']
};


/* COMMANDS FOR DEVELOPERS
* 'develop':   spin up dev server, watch HTML/SASS/JS/JSX source files for changes,
*              build bundles with source maps, and opens browser (w/live reloading)
* 'build':     cleans existing build bundles, builds optimized css and js
               without sourcemaps, uglified, using all webpack optimizations
* 'clean':     delete all files in './build'
* 'lint':      run code linting
* 'unittests': run unit tests and code coverage
* 'test':      run linting AND unit tests with code coverage
* 'report':    open unit test coverage report in browser
*/

/* NOTE: For live reload to work, the connect server and the reload command must be
* run by the same process
*/

// Run 'develop' task defined in intro (see top of file)
gulp.task('develop', [
  'serve:dev',
  'watch-html',
  'watch-and-build-sass:dev',
  'watch-and-build-js:dev',
  'open-url:dev'
]);

// Run 'build' task defined in intro (see top of file)
gulp.task('build', function(callback){
  runSequence(
    'clean',
    'build-sass:prod',
    'build-js:prod',
    callback
  );
});

// Run 'clean' task defined in intro (see top of file)
gulp.task('clean', function() {
  gulp.src('build/*')
    .pipe(clean());
  gutil.log('[clean]', 'Deleted all files from build folder');
});


// Run 'lint' task defined in intro (see top of file)
gulp.task('lint', function () {
  // Note: To have the process exit with an error code (1) on
  //  lint error, return the stream and pipe to failOnError last.
  return gulp.src([paths.js])
    .pipe(eslint())
    .pipe(eslint.format());
});


// Run 'unittests' task defined in intro (see top of file)
gulp.task('unittests', function() {
  // Run scripts before tests
  // This is a good place to insert globals for test running, if necessary

  // Create a fake global `window` and `document` object if 'document' doesn't exist
  testdom('<html><body><div id="todo-app"></div></body></html>');

  // Make Chai available for all unit tests
  global.expect = require('chai').expect;

  // Run testcop to generate unit test scaffold for source files missing unit tests
  testcop(paths.js, '.tests');

  (jsxcoverage.createTask({
    src: [paths.tests],                                            // will pass to gulp.src
    istanbul: {                                                    // will pass to istanbul
        coverageVariable: '__MY_TEST_COVERAGE__',
        exclude: /node_modules|\.tests\.(js|jsx)/
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


// Run 'test' task defined in intro (see top of file)
gulp.task('test', function(callback){
  runSequence('lint', 'unittests', callback);
});


// Run 'report' task defined in intro (see top of file)
gulp.task('report', function(){
  gulp.src('./coverage/lcov-report/index.html')
  .pipe(open('<%file.path%>'));
});


/******************************************
* SUBTASKS USED BY TASKS DEFINED IN INTRO
*******************************************/


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
    gutil.log('[watch-html]', ' Reloaded New HTML Assets in Browser');
  });
});


// Compile SASS to single CSS in Dev Mode
// with sourcemaps and not minified
// ======================================
gulp.task('build-sass:dev', function(){
  gulp.src('./styles.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({
      errLogToConsole: true
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./build'))
    .pipe(connect.reload());
  gutil.log('[build-sass:dev]', ' Reloaded New SASS Assets in Browser');
});


// Watch SASS source files for changes,
// rebuild, and trigger browser reload
// ===================================
gulp.task('watch-and-build-sass:dev', ['build-sass:dev'], function(){
  gulp.watch(paths.sass, ['build-sass:dev']);
});


// Build Client JS Bundle (Development)
// Watches for file changes
// Triggers live-reload (via gulp-connect)
// ====================================
gulp.task('watch-and-build-js:dev', function() {
  // Bundle the static assets
  webpack(webpackConfig, function(err, stats) {
    if (err) {
      throw new gutil.PluginError('watch-and-build-sass:dev', err);
    }

    // show output only on errors
    if (stats.hasErrors()) {
      gutil.log('[watch-and-build-sass:dev]', stats.toString({colors: true}));
    }

    gutil.log('[watch-and-build-sass:dev]', ' Built JS Bundle');
    gulp.src('./build/bundle.js')
      .pipe(connect.reload());
    gutil.log('[watch-and-build-sass:dev]', ' Reloaded New JS Bundle in Browser');
  });
});

// Build Optimized SASS Bundle (Deployment)
// Minified, no source maps
// ====================================
gulp.task('build-sass:prod', function(){
  gulp.src('./styles.scss')
    .pipe(sass({
      errLogToConsole: true,
      outputStyle: 'compressed'
    }))
    .pipe(gulp.dest('./build'));
  gutil.log('[build-sass:prod]', 'Compiled SASS to production-ready minified CSS');
});


// Build Optimized JS Bundle (Deployment)
// Uglified, Webpack optimized, no source maps
// ====================================
gulp.task('build-js:prod', function(callback) {
  // modify some webpack config options
  var myConfig = Object.create(webpackConfig);
  myConfig.devtool = false;
  myConfig.watch = false;
  myConfig.plugins = myConfig.plugins.concat(
    new webpack.DefinePlugin({
      'process.env': {
        // This has effect on the react lib size
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin()
  );

  // run webpack
  webpack(myConfig, function(err, stats) {
    if (err) {
      throw new gutil.PluginError('build-js:prod', err);
    }

    // show output only on errors
    if (stats.hasErrors()) {
      gutil.log('[build-js:prod]', stats.toString({colors: true}));
    }

    gutil.log('[build-js:prod]', 'Compiled JS/JSX to production-ready uglified JS');
    callback();
  });
});
