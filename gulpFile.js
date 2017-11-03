'use strict';

var gulp = require('gulp'),
  sass = require('gulp-sass'),
  uglify = require('gulp-uglify'),
  concat = require('gulp-concat'),
  gulpxlsx = require('gulp-js-xlsx'),
  rename = require('gulp-rename'),
  browsersync = require('browser-sync').create();

gulp.task('build', ['css','scripts']);

gulp.task('prototype', ['browser-sync'], function() {
  gulp.watch("scss/**/*.scss", ['css']);
  gulp.watch("js/**/*.js", ['scripts']);
  gulp.watch("*.html", ['bs-reload'])
});


var prototype_config = {
  server: true,
  files: 'css/*.css'
};


gulp.task('browser-sync',function() {
  browsersync.init(prototype_config);
});

gulp.task('convert', function() {
 gulp.src('xlsx/*.xlsx')
        .pipe(gulpxlsx.run({
            parseWorksheet: 'tree'
        }))
        .pipe(rename({extname: '.json'}))
        .pipe(gulp.dest('json'));
});

gulp.task('bs-reload', function() {
  browsersync.reload();
});

gulp.task('css', function() {
  return gulp.src('scss/**/*.scss')
    .pipe(sass().on('error', function(err) {
            console.error(err.message);
            browsersync.notify(err.message, 3000); // Display error in the browser
            this.emit('end'); // Prevent gulp from catching the error and exiting the watch process
        }))
    .pipe(gulp.dest('css'))
    .pipe(browsersync.reload({stream:true}));
});


gulp.task('scripts', function() {
  return gulp.src([''])
    .pipe(concat('scripts.js', {newLine:'\r\n'}))
    .pipe(gulp.dest('./js/'))
    .pipe(browsersync.stream());
});

gulp.task('min-scripts', function() {
  return gulp.src('js/scripts.min.js')
    .pipe(uglify())
    .pipe(gulp.dest('./js/'));
});