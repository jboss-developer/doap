'use strict';

// gulp plugins
var gulp           = require('gulp'),
    gutil          = require('gulp-util'),
    del            = require('del'),
    deploy         = require('gulp-gh-pages'),
    uglify         = require('gulp-uglify'),
    sourcemaps     = require('gulp-sourcemaps'),
    //jshint         = require('gulp-jshint'),
    //usemin         = require('gulp-usemin'),
    //googlecdn = require('gulp-google-cdn'),
    //karma          = require('gulp-karma'),
    mainBowerFiles = require('main-bower-files'),
    jade           = require('gulp-jade');

gulp.task('clean', function (cb) {
  del(['dist/**'], cb);
});

gulp.task('compile-jade', function() {
  gulp.src('./src/*.jade')
    .pipe(jade({}))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('compile-scripts', function() {
  gulp.src('./src/scripts/*')
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./dist/scripts/'));
  gulp.src(mainBowerFiles({filter: /\.js$/i}))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./dist/scripts/'));
});

gulp.task('compile-css', function() {
  gulp.src(mainBowerFiles({filter: /\.css$/i}))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./dist/styles'));
});

gulp.task('compile', ['compile-jade','compile-css','compile-scripts'], function() {});

gulp.task('deploy', ['compile'], function () {
    gulp.src("./dist/**/*")
        .pipe(deploy(options));
});

gulp.task('default', ['deploy'], function () {});

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

