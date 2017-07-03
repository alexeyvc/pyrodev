var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var pug = require('gulp-pug');
var sass = require('gulp-sass');
var spritesmith = require('gulp.spritesmith');
var rimraf = require('rimraf');
var spritesmith = require('gulp.spritesmith');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');

/*----------------- Server-----------------*/
gulp.task('server', function() {
  browserSync.init({
    server: {
      port: 3000,
      baseDir: "build"
    }
  });

  gulp.watch('build/**/*').on('change', browserSync.reload);
});

/*-------------Pug compile-------------*/
gulp.task('templates:compile', function buildHTML() {
  return gulp.src('source/template/index.pug')
    .pipe(pug({
      pretty: true
    }))
    .pipe(gulp.dest('build'))
});

/*-------------Styles compile-------------*/
gulp.task('styles:compile', function() {
  return gulp.src('source/styles/main.scss')
    .pipe(sass({
      outputStyle: 'compressed'
    }).on('error', sass.logError))
    .pipe(rename('main.min.css'))
    .pipe(gulp.dest('build/css'));
});

/*-------------Sprite-------------*/
gulp.task('sprite', function(cb) {
  var spriteData = gulp.src('source/images/icons/*.png').pipe(spritesmith({
    imgName: 'sprite.png',
    imgPath: '../images/sprite.png',
    cssName: 'sprite.scss'
  }));

  spriteData.img.pipe(gulp.dest('build/images/'));
  spriteData.css.pipe(gulp.dest('source/styles/global/'));
  cb();
});

/*-------------Delete-------------*/
gulp.task('clean', function del(cb) {
  return rimraf('build', cb);
});

/*-------------Copy fonts -------------*/
gulp.task('copy:fonts', function() {
  return gulp.src('./source/fonts/**/*.*')
    .pipe(gulp.dest('build/fonts'));
});

/*-------------Copy images -------------*/
gulp.task('copy:images', function() {
  return gulp.src('./source/images/**/*.*')
    .pipe(gulp.dest('build/images'));
});

/*-------------Copy JS -------------*/
gulp.task('copy:js', function() {
  return gulp.src('./source/js/**/*.*')
    .pipe(gulp.dest('build/js'));
});

/*-------------Copy CSS -------------*/
gulp.task('copy:css', function() {
  return gulp.src('./source/styles/global/*.css')
    .pipe(gulp.dest('build/css'));
});
/*-------------Copy-------------*/
gulp.task('copy', gulp.parallel('copy:fonts', 'copy:images', 'copy:css', 'copy:js'));

/*-------------Watchers-------------*/
gulp.task('watch', function() {
  gulp.watch('source/template/**/*.pug', gulp.series('templates:compile'));
  gulp.watch('source/styles/**/*.scss', gulp.series('styles:compile'));
});

gulp.task('default', gulp.series(
  'clean',
  gulp.parallel('templates:compile', 'styles:compile', 'sprite', 'copy'),
  gulp.parallel('watch', 'server')
));
