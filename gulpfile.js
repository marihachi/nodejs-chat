var gulp = require('gulp');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var del = require('del');
var seq = require('run-sequence');

gulp.task('build', function (callback) {
	seq(
		'build:clean',
		['build:autoprefixer', 'build:copy'],
		callback
	);
});

gulp.task('build:clean', function () {
	return del(['./dest']);
});

gulp.task('build:autoprefixer', function () {
	return gulp.src('./src/*.css')
		.pipe(postcss([ autoprefixer({ browsers: ['last 2 versions'] }) ]))
		.pipe(gulp.dest('./dest'));
});

gulp.task('build:copy', function () {
	return gulp.src(['./src/**','!./src/*.css'])
		.pipe(gulp.dest('./dest'));
});

gulp.task('test', []);