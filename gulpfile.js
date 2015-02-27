var gulp       = require('gulp');
var browserify = require('browserify');
var babelify   = require('babelify');
var watchify   = require('watchify');
var streamify  = require('gulp-streamify');
var source     = require('vinyl-source-stream'); // Used to stream bundle for further handling
var uglify     = require('gulp-uglify');
var rename     = require('gulp-rename');


// Watch & Build Client JS Bundle
// with source maps for debugging
// ====================================
gulp.task('develop', function() {
  babelify.configure({ // Babelify transforms .es6, .es, .js, and .jsx to ES5
    sourceMapRelative: './js/' // Gives us sourcemapping from transpiled to ES5 files
  });

  var bundler = browserify({
    entries: ['./js/app.jsx'], // Only need initial file, browserify finds the deps
    transform: [babelify],
    debug: true, // Gives us sourcemapping
    cache: {}, packageCache: {}, fullPaths: true // Requirement of watchify
  });

  var watcher  = watchify(bundler);

  return watcher
  .on('update', function () { // When any files update
    var updateStart = Date.now();
    console.log('Updating!');
    watcher.bundle() // Create new bundle that uses the cache for high performance
    .pipe(source('bundle.js'))
    .pipe(streamify(uglify({
      outSourceMap: true // Output source Map
    })))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('./js/build/'));
    console.log('Updated!', (Date.now() - updateStart) + 'ms');
  })
  .bundle() // Create the initial bundle when starting the task
  .pipe(source('bundle.js'))
  .pipe(gulp.dest('./js/build/'));
});


// Build Uglified JS Bundle for Deployment
// no sourcemaps
// ====================================
gulp.task('build', function() {
  return browserify({
    entries: ['./js/app.jsx'], // Only need initial file, browserify finds the deps
    transform: [babelify]
  })
  .bundle()
  .pipe(source('bundle.js')) // gives streaming vinyl file object
  .pipe(streamify(uglify()))
  .pipe(gulp.dest('./js/build/'));
});