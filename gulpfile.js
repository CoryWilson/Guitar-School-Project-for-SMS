var gulp         = require('gulp'),
    browserify   = require('browserify'),
    browserSync  = require('browser-sync').create();
    bower        = require('gulp-bower'),
    childProcess = require('child_process'),
    gzip         = require('gulp-gzip'),
    minifyCss    = require('gulp-minify-css'),
    nodemon      = require('gulp-nodemon'),
    notify       = require('gulp-notify'),
    rename       = require('gulp-rename'),
    reload       = browserSync.reload,
    sass         = require('gulp-sass'),
    sourcemaps   = require('gulp-sourcemaps'),
    transform    = require('vinyl-transform'),
    uglify       = require('gulp-uglify'),
    watchify     = require('watchify');

var config = {
  fontPath : './dev/fonts',
  sassPath : './dev/sass',
  jsPath   : './dev/js',
	bowerDir : './bower_components'
};

gulp.task('browserify', function(){
  var browserified = transform(function(filename){
    var b = browserify(filename);
    return b.bundle();
  });
  return gulp.src([config.jsPath+'/*.js'])
    .pipe(browserified)
    .pipe(uglify())
    .pipe(gulp.dest('./site/assets/js'));
});

gulp.task('fonts', function(){
  gulp.src('./dev/fonts/**/*')
    .pipe(gulp.dest('./site/assets/fonts'));
});

gulp.task('html', function(){
  gulp.src('./*.html')
    .pipe(gulp.dest('./site'));
});

gulp.task('html-watch',['html'],browserSync.reload);

gulp.task('scripts', function(){
  gulp.src(config.jsPath+'/*.js')
    .pipe(sourcemaps.init())
      .pipe(uglify())
    .pipe(sourcemaps.write('../../../maps/js'))
    .pipe(gulp.dest('./site/assets/js'));
});

gulp.task('script-watch',['scripts'],browserSync.reload);

gulp.task('styles', function(){
  gulp.src(config.sassPath+'/main.scss')
    .pipe(sourcemaps.init())
      .pipe(sass())
      .pipe(minifyCss())
      .pipe(rename('main.min.css'))
    .pipe(sourcemaps.write('../../../maps/css'))
    .pipe(gulp.dest('./site/assets/css'))
    .pipe(browserSync.stream());
});

gulp.task('bower', function(){
  return bower(config.bowerDir)
    .pipe(gulp.dest('./site/assets/js/vendor'));
});

gulp.task('serve',['styles'], function(){
  browserSync.init({
    server: './site'
  });
  gulp.watch(config.sassPath+'/*.scss',['styles']);
  gulp.watch(config.jsPath+'/*.js',['script-watch']);
  gulp.watch('./*.html',['html-watch']);
});

gulp.task('default', ['bower','html','fonts','scripts','serve']);
