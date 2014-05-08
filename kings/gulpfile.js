var gulp = require('gulp');
var gutil = require('gulp-util');

var less = require('gulp-less');
var react = require('gulp-react');
var prefix = require('gulp-autoprefixer');

const SRC = 'www';

const HTTP_PORT = 8000;

var paths = {
  jsx: SRC + '/js/src/*.jsx',
  less: SRC + '/css/*.less'
};

gulp.task('less', function () {
  return gulp.src(paths.less)
    .pipe(less())
    .pipe(prefix("last 1 version", "> 1%", "ie 8", "ie 7"))
    .pipe(gulp.dest(SRC + '/css'));
});

gulp.task('jsx', function () {
  return gulp.src(paths.jsx)
    .pipe(react())
    .pipe(gulp.dest(SRC + '/js'));
});

gulp.task('compile', ['less', 'jsx']);

gulp.task('watch', ['compile'], function () {
  gulp.watch(paths.less, ['less']);
  gulp.watch(paths.jsx, ['jsx']);
});

function server(root) {
  require('http').createServer(
    require('ecstatic')({ root: root })
  ).listen(HTTP_PORT);

  gutil.log('Serving files at http://localhost:' + HTTP_PORT);
}

gulp.task('http', function () {
  server(SRC)
});

gulp.task('development', ['watch', 'http']);
