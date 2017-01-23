'use strict';

const gulp = require('gulp');
const babel = require('gulp-babel');
const connect = require('gulp-connect');
const less = require('gulp-less');


gulp.task('babel', () => {
    gulp.src('js/*.js')
        .pipe(babel({presets: ['es2015']}))
        .on('error', (err) => console.log('Error parsing with Babel:', err.message))
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

gulp.task('libs', () => {
    gulp.src(
        [
            // Using non-minified Vue libs for debugging purposes.
            'node_modules/vue/dist/vue.js',
            'node_modules/vue-resource/dist/vue-resource.min.js'
        ])
        .pipe(gulp.dest('dist'));
});

gulp.task('serve', () => {
    connect.server({
        root: 'dist',
        port: process.env.PORT || 5000
    });
});

gulp.task('watch', () => {
    gulp.watch('js/*.js', ['babel']);
    gulp.watch('less/*.less', ['less']);
    gulp.watch('src/*', ['src']);
});

gulp.task('build', ['babel', 'less', 'src', 'libs']);
gulp.task('default', ['build', 'serve', 'watch']);
