/*jshint node:true */
'use strict';

var gulp = require('gulp');

var sass = require('node-sass');
var concat = require('gulp-concat');
var fs = require('fs');
var path = require('path');

gulp.task('js', function () {
  gulp.src([
      './client/lib/angular/angular.js',
      './client/lib/angular-bootstrap/ui-bootstrap.js',
      './client/lib/angular-bootstrap/ui-bootstrap-tpls.js',
      './client/lib/ui-router/release/angular-ui-router.js',
      './client/app/services/auth-factory.js',
      './client/app/home/home.js',
      './client/app/templates/add-image.js',
      './client/app/app.js',
      './client/lib/ngSocket/dist/ngSocket.js',
      './client/lib/ng-file-upload/angular-file-upload.js',
    ])
    .pipe(concat('main.js'))
    // .pipe(uglify())
    .pipe(gulp.dest('./client/dist/'));
});


gulp.task('sass', function () {
  sass.render({
    file: './client/assets/scss/main.scss',
  }, function (err, result) {
    if (err) {
      console.log(err);
    }
    fs.writeFileSync(
      path.join(__dirname, '/client/dist/main.css'),
      result.css.toString()
    );
  });
});

gulp.task('watch', ['js', 'sass'], function () {
  gulp.watch('./client/assets/scss/**/*.scss', ['sass']);
  gulp.watch('./client/app/**/*.js', ['js']);
});

gulp.task('default', ['js', 'sass']);
gulp.task('build', ['js', 'sass']);
