"use strict";

var gulp = require("gulp"),
    umd = require("gulp-umd"),
    uglify = require("gulp-uglify"),
    rename = require("gulp-rename");

/*----------------------------------------------
  Uglify JS
-----------------------------------------------*/
gulp.task("default", function() {
  return gulp.src("src/*.js")
    .pipe(umd({
      exports: function(file) {
        return 'objectFitPolyfill';
      },
      namespace: function(file) {
        return 'objectFitPolyfill';
      },
    }))
    .pipe(uglify())
    .pipe(rename({suffix: ".min"}))
    .pipe(gulp.dest("dist/"));
});
