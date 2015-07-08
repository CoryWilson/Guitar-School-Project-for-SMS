var gulp       = require('gulp'),
    browserify = require('browserify'),
    bower      = require('gulp-bower'),
    minifyCss  = require('gulp-minify-css'),
    nodemon    = require('gulp-nodemon'),
    notify     = require('gulp-notify'),
    rename     = require('gulp-rename'),
    sass       = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify     = require('gulp-uglify'),
    watchify   = require('watchify');

var config = {
  sassPath : './dev/sass',
  jsPath   : './dev/js',
	bowerDir : './bower_components'
};

gulp.task('sass', function(){
  gulp.src(config.sassPath+'/main.scss')
    .pipe(sourcemaps.init())
      .pipe(sass())
      .pipe(minifyCss())
      .pipe(rename('main.min.css'))
    .pipe(sourcemaps.write('../../../maps'))
    .pipe(gulp.dest('./site/assets/css'));
});

gulp.task('default', ['sass']);
