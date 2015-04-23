'use strict';

var browserify = require('browserify');
var gulp = require('gulp');
var transform = require('vinyl-transform');
var gutil = require('gulp-util');
var reactify = require('reactify');
var source = require('vinyl-source-stream');
var preloadify = require('./server/preloadify');

gulp.task('default', function() {
  console.log("=======================");
  console.log(" - Preparing application building ...");

  // Browserify/bundle the JS.
  browserify(['./common/browserify-files.js'])
    .transform(reactify)
    .bundle().on('error', handleError)
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('./client/js/'));
  console.log(" -- Bundle created");

  // Create preloader file
  preloadify(['./client/images', './client/sound'], './client/js/preload.js', './client/');
  console.log(" -- Preloader created");

  console.log(" - Completed");
  console.log("-----------------------");
});

function handleError(err) {
	console.log("!!!!!!!!!!!!!");
	console.log(" GULP ERROR ");
	console.log("!!!!!!!!!!!!!");
	console.log(err.toString());
}

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch('common/**/*.js', ['default']);
});