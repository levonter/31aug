var gulp = require('gulp'),
sass = require('gulp-ruby-sass'),
autoprefixer = require('gulp-autoprefixer'),
minifycss = require('gulp-minify-css'),
rename = require('gulp-rename');

var EXPRESS_PORT = 4000;
var EXPRESS_ROOT = __dirname;
var LIVERELOAD_PORT = 35729;

// Let's make things more readable by
// encapsulating each part's setup
// in its own method
function startExpress() {

	var express = require('express');
	var app = express();
	app.use(require('connect-livereload')());
	app.use(express.static(EXPRESS_ROOT));
	app.listen(EXPRESS_PORT);
}

// We'll need a reference to the tinylr
// object to send notifications of file changes
// further down
var lr;
function startLivereload() {

	lr = require('tiny-lr')();
	lr.listen(LIVERELOAD_PORT);
}

// Notifies livereload of changes detected
// by `gulp.watch()` 
function notifyLivereload(event) {

  // `gulp.watch()` events provide an absolute path
  // so we need to make it relative to the server root
  var fileName = require('path').relative(EXPRESS_ROOT, event.path);

  lr.changed({
  	body: {
  		files: [fileName]
  	}
  });
}

// Default task that will be run
// when no parameter is provided
// to gulp
gulp.task('default', function () {
	startExpress();
	startLivereload();
	gulp.watch('*.html', notifyLivereload);
});


gulp.task('styles', function() {
	return sass('sass', { style: 'expanded' })
	.pipe(gulp.dest('css'))
	.pipe(rename({suffix: '.min'}))
	.pipe(minifycss())
	.pipe(gulp.dest('css'));
});


var gulp = require('gulp'),
sass = require('gulp-ruby-sass'),
autoprefixer = require('gulp-autoprefixer'),
minifycss = require('gulp-minify-css'),
rename = require('gulp-rename');

gulp.task('express', function() {
	var express = require('express');
	var app = express();
	app.use(require('connect-livereload')({port: 35729}));
	app.use(express.static(__dirname));
	app.listen(4000, '0.0.0.0');
});

var tinylr;
gulp.task('livereload', function() {
	tinylr = require('tiny-lr')();
	tinylr.listen(35729);
});

function notifyLiveReload(event) {
	var fileName = require('path').relative(__dirname, event.path);

	tinylr.changed({
		body: {
			files: [fileName]
		}
	});
}

// gulp.task('styles', function() {
// 	return less('less', { style: 'expanded' })
// 	.pipe(gulp.dest('css'))
// 	.pipe(rename({suffix: '.min'}))
// 	.pipe(minifycss())
// 	.pipe(gulp.dest('css'));
// });

gulp.task('watch', function() {
	// gulp.watch('assets/less/*.less', ['styles']);
	gulp.watch('*.html', notifyLiveReload);
	gulp.watch('assets/css/*.css', notifyLiveReload);
});

gulp.task('default', ['express', 'livereload', 'watch'], function() {

});



