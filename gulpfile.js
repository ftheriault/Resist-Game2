'use strict';

var browserify = require('browserify');
var gulp = require('gulp');
var transform = require('vinyl-transform');
var gutil = require('gulp-util');
var reactify = require('reactify');
var source = require('vinyl-source-stream');

gulp.task('default', function() {
  console.log("=======================");
  console.log(" Preparing application");
  console.log("-----------------------");

  // Browserify/bundle the JS.
  browserify(['./common/browserify-files.js'])
    .transform(reactify)
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('./client/js/'));


  console.log("- Completed");
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch('common/**/*.js', ['default']);
});