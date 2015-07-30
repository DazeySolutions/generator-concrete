var gulp = require('gulp');
var less = require('gulp-less');
var del = require('del');
var path = require('path');
var minifyCSS = require('gulp-minify-css');
var jshint = require('gulp-jshint');

gulp.task('less-dev', function(){
	return gulp.src('src/less/*.less')
		.pipe(less())
		.pipe(gulp.dest('assets/css'));
});

gulp.task('less', function(){
	var LessPluginCleanCSS = require('less-plugin-clean-css'),
    cleancss = new LessPluginCleanCSS({ advanced: true });
 
	return gulp.src('src/less/*.less')
		.pipe(less({
			plugins: [cleancss]
		}))
		.pipe(minifyCSS())
		.pipe(gulp.dest('assets/css'));
});

gulp.task('copy', ['copy:fonts', 'copy:libraries']);

gulp.task('copy:fonts', function(){
	return gulp.src(['bower_components/fontawesome/fonts/*', 'bower_components/bootstrap/fonts/*'])
		.pipe(gulp.dest('assets/fonts'));
});
gulp.task('copy:libraries', function(){
	return gulp.src([
						'bower_components/jquery/dist/*', 
						'bower_components/bootstrap/dist/js/*', 
						'bower_components/angular/angular.js', 
						'bower_components/angular/angular.min.js', 
						'bower_components/angular/angular.min.js.map',
					])
		.pipe(gulp.dest('assets/js'));
});

gulp.task('lint', function(){
	return gulp.src('src/js/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('clean', function(cb){
	del([
		'assets/css/**/*',
		'assets/fonts/**/*',
		'assets/js/**/*'
	], cb);
});

gulp.task('default', ['clean', 'less', 'copy', 'lint']);
gulp.task('dev', ['clean', 'less-dev', 'copy', 'lint']);