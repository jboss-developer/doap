'use strict';

// gulp plugins
var gulp           = require('gulp'),
    gutil          = require('gulp-util'),
    rimraf         = require('gulp-rimraf'),
    //jshint         = require('gulp-jshint'),
    //usemin         = require('gulp-usemin'),
    //googlecdn = require('gulp-google-cdn'),
    //karma          = require('gulp-karma'),
    mainBowerFiles = require('main-bower-files'),
    jade           = require('gulp-jade');

gulp.task('clean', function (cb) {
  return gulp.src('./dist', { read: false })
    .pipe(rimraf({ force: true }));
});

gulp.task('compile', function() {
  gulp.src('./src/*.jade')
    .pipe(jade({}))
    .pipe(gulp.dest('./dist/'))
});

gulp.task('default', function () {
  gutil.log('Default task goes here...');
});

//var testFiles = ['spec/*.js'];

//gulp.task('test', function() {
  //// Be sure to return the stream
  //return gulp.src(testFiles)
    //.pipe(karma({
      //configFile: 'karma.conf.js',
      //action: 'start'
    //}))
    //.on('error', function(err) {
      //// Make sure failed tests cause gulp to exit non-zero
      //throw err;
    //});
//});                        

//// TODO: may need to do other things here
//gulp.task('watch-tests', function() {
  //gulp.src(testFiles)
    //.pipe(karma({
      //configFile: 'karma.conf.js',
      //action: 'watch'
    //}));
//});

//gulp.task('watch', ['watch-tests'], function() {});

