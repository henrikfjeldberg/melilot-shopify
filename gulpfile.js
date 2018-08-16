// Compiles SCSS files
var sass         = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
// Notifies of errors
var notify = require("gulp-notify");
// Gulp plugin setup
var gulp = require('gulp');
// Watches single files
var watch = require('gulp-watch');
var gulpShopify = require('gulp-shopify-upload');
// Grabs your API credentials
var config = require('./config.json');

function handleErrors() {
  var args = Array.prototype.slice.call(arguments);

  // Send error to notification center with gulp-notify
  notify.onError({
    title: "Compile Error",
    message: "<%= error %>"
  }).apply(this, args);

  // Keep gulp from hanging on this task
  this.emit('end');
}

gulp.task('sass', function () {
  gulp.src('./styles/scss/*.{sass,scss}')
    .pipe(sass({includePaths: neat}))
    .on('error', handleErrors)
    .pipe(autoprefixer({ browsers: ['last 2 version'] }))
    .pipe(gulp.dest('./motion/assets'));
});

gulp.task('watch', function () {
  gulp.watch('./lib/scss/**/*.{sass,scss}', ['sass']);
});

gulp.task('shopifywatch', function() {
  var options = {
    "basePath": "./motion/"
  };

  return watch('./motion/+(assets|layout|config|snippets|templates|locales)/**')
  .pipe(gulpShopify(config.shopify_api_key, config.shopify_api_password, config.shopify_url, null, options));
});

// Default gulp action when gulp is run
gulp.task('default', [
  'shopifywatch', 'watch'
]);