'use strict';

// gulp plugins
var gulp           = require('gulp'),
    webserver      = require('gulp-webserver'),
    del            = require('del'),
    deploy         = require('gulp-gh-pages'),
    uglify         = require('gulp-uglify'),
    sourcemaps     = require('gulp-sourcemaps'),
    jshint         = require('gulp-jshint'),
    sass           = require('gulp-sass'),
    concat         = require('gulp-concat'),
    //googlecdn = require('gulp-google-cdn'),
    //karma          = require('gulp-karma'),
    //gutil          = require('gulp-util'),
    mainBowerFiles = require('main-bower-files'),
    jade           = require('gulp-jade');

function errorLog(error) {
  console.error.bind(error);
  this.emit('end');
}

gulp.task('clean', function (cb) {
  del(['dist/**'], cb);
});

gulp.task('compile-jade', function() {
  gulp.src('src/*.jade')
    .pipe(jade({}))
    .on('error', errorLog)
    .pipe(gulp.dest('dist'));
});

gulp.task('compile-scripts', function() {
  var files = mainBowerFiles({filter: /\.js$/i});
  files.push('./src/scripts/**/*');

  gulp.src(files)
    .pipe(jshint())
    .on('error', errorLog)
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(concat('all.js'))
    .pipe(uglify())
    .on('error', errorLog)
    .pipe(sourcemaps.write('maps'))
    .pipe(gulp.dest('./dist/scripts/'));
});

gulp.task('compile-css', function() {
  var files = ['./src/styles/**/*.scss', 'bower_components/foundation-multiselect/zmultiselect/zurb5-multiselect.css'];

  gulp.src(files)
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'compressed'}))
    .on('error', errorLog)
    .pipe(concat('app.css'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./dist/styles'));
});

gulp.task('compile', ['compile-jade','compile-css','compile-scripts'], function() {});

gulp.task('deploy', ['compile'], function () {
  return gulp.src("dist/**/*")
    .pipe(deploy());
});

gulp.task('server', function(next) {
  gulp.src('dist')
    .pipe(webserver({
      livereload: true
    }));
});

gulp.task('watch', function() {
  gulp.watch(['src/*.jade','src/**/*.jade','src/**/*.mst'], ['compile-jade']);
  gulp.watch('src/**/*.js', ['compile-scripts']);
  gulp.watch('src/**/*.scss', ['compile-css']);
});

gulp.task('default', ['server','watch','compile'], function () {});
//gulp.task('default', ['watch'], function () {});

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

