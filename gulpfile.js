'use strict';

const babelify = require('babelify');
const browserify = require('browserify');
const gulp = require('gulp');
const connect = require('gulp-connect');
const less = require('gulp-less');
const source = require('vinyl-source-stream');
const vueify = require('vueify');


gulp.task('browserify', () => {
    browserify('js/main.js')
        .transform(babelify)
        .transform(vueify)
        .bundle()
        .on('error', (err) => console.log('Error parsing with Browserify:', err.message))
        .pipe(source('script.js'))
        .pipe(gulp.dest('dist'));
});

gulp.task('less', () => {
    gulp.src('less/*.less')
        .pipe(less())
        .on('error', (err) => console.log('Error parsing LESS:', err.message))
        .pipe(gulp.dest('dist'));
});

gulp.task('src', () => {
    gulp.src('src/*')
        .pipe(gulp.dest('dist'));
});

gulp.task('serve', () => {
    connect.server({
        root: 'dist',
        port: process.env.PORT || 5000
    });
});

gulp.task('watch', () => {
    gulp.watch(['js/*.js', 'vue/*.vue'], ['browserify']);
    gulp.watch('less/*.less', ['less']);
    gulp.watch('src/*', ['src']);
});

gulp.task('build', ['browserify', 'less', 'src']);
gulp.task('default', ['build', 'serve', 'watch']);