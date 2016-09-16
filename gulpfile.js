var gulp = require('gulp');
var batch = require('gulp-batch');
var watch = require('gulp-watch');
var clean = require('gulp-clean');
var header = require('gulp-header');
var gutil = require('gulp-util');
var shell = require('gulp-shell');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var copy = require('gulp-contrib-copy');
var size = require('gulp-size');
var connect = require('gulp-connect');
var notify = require('gulp-notify');
var data = require('gulp-data');

var jade = require('jade');
var gulpJade = require('gulp-jade');
var katex = require('katex');

var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var babelify = require('babelify');
var watchify = require('watchify');
var runSequence = require('run-sequence');
var sort = require('gulp-sort');

/// Headers
/// ----------------------------------------------------------------------------

var pkg = require('./package.json');
var banner_css = ['/**',
  ' * <%= pkg.title %> (<%= pkg.name %>)',
  ' * <%= pkg.description %>',
  ' * by <%= pkg.author.name %> (<%= pkg.author.email %>)',
  ' * @version v<%= pkg.version %>',
  ' * @link <%= pkg.homepage %>',
  ' * @license <%= pkg.license %>',
  ' */',
  ''].join('\n');

/// SCSS
/// ----------------------------------------------------------------------------

gulp.task('sass-build', shell.task(['compass compile']));

gulp.task('autoprefixer', function () {
  var postcss = require('gulp-postcss');
  var autoprefixer = require('autoprefixer');
  return gulp.src('./app/assets/css/*.css')
    .pipe( header(banner_css, { pkg : pkg } ) )
    .pipe( postcss([ autoprefixer({ browsers: ['> 5%', 'last 2 versions', 'IE 9'] }) ]) )
    .pipe( gulp.dest('./app/assets/css') );
});

gulp.task('css-build', function (callback) {
  runSequence(
    'clean-css',
    'sass-build',
    'autoprefixer',
    'size',
    function (error) {
      if (error) {
        console.log(error.message);
      }
      callback(error);
    });
});


/// JS
/// ----------------------------------------------------------------------------

function bundle (bundler) {
  return bundler
    .transform(babelify)
    .bundle()
    .on('error', function(e) {
      gutil.log(e);
    })
    .pipe(source('bundle.min.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(uglify())
        .on('error', gutil.log)
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./app/assets/js'))
    .pipe(size({showFiles: true}));
}

gulp.task('js-build', function () {
  browserify('./src/scripts/main.js');
});

/// Jade
/// ----------------------------------------------------------------------------

jade.filters.katex = katex.renderToString;
jade.filters.shoutFilter = function (str) {
  return str + '!!!!';
}

gulp.task('jade-build', function () {
  return gulp.src('./src/templates/**/!(_)*.jade')
    // .pipe(data(function(file) {
    //   return { "data": require('./src/templates/_data/_config.json') }
    // }))
    .pipe(gulpJade({
      jade: jade,
      pretty: true
    }))
    .on('error', notify.onError(function (error) {
      return 'An error occurred while compiling jade.\nLook in the console for details.\n' + error;
    }))
    .pipe(gulp.dest('./app'))
});

/// Misc
/// ----------------------------------------------------------------------------

// clean out theme css dir
gulp.task('clean-css', function () {
	return gulp
    .src(['./app/assets/css/*.**'], { read: false })
		.pipe(clean({force: true}));
});

gulp.task('clean-js', function () {
	return gulp
    .src(['./app/assets/js/*.**'], { read: false })
		.pipe(clean({force: true}));
});

gulp.task('size', function () {
  gulp.src([
    './app/assets/css/vui.css',
    './app/assets/js/bundle.min.js'
  ])
  .pipe(size({showFiles: true}));
});

/// Connect
/// ----------------------------------------------------------------------------

gulp.task('connect', function() {
  connect.server({
    root: './app',
    livereload: true
  });
});

/// Watch
/// ----------------------------------------------------------------------------

gulp.task('watch', function () {
  // serve
  gulp.start('connect');
  // js
  gulp.start('js-build');
  var watcher = watchify(browserify('./src/scripts/main.js', watchify.args));
      bundle(watcher);

      watcher.on('update', function () {
        bundle(watcher);
        gulp.start('size');
      });

      watcher.on('log', gutil.log);

  // scss
  gulp.watch('./src/styles/**/*.scss', ['css-build']);

  // jade
  gulp.watch('./src/templates/**/*.jade', ['jade-build']);
});

/// Default
/// ----------------------------------------------------------------------------

gulp.task('default', function (callback) {
  runSequence(
    'clean-js',
    'clean-css',
    'sass-build',
    'autoprefixer',
    'js-build',
    'jade-build',
    'size',
    function (error) {
      if (error) {
        console.log(error.message);
      }
      callback(error);
    });
});
