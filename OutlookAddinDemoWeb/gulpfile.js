// Required dependencies.
var gulp = require('gulp');
var terser = require('gulp-terser');
var concat = require('gulp-concat');
var htmlreplace = require('gulp-html-replace');
var jsonModify = require('gulp-json-modify');

// Create application script bundle.
gulp.task('build.scripts.prod', function () {
    return gulp.src(['Scripts/App/*.js',
                     'Scripts/App/Common/Data/*.js',
                     'Scripts/App/Common/Config/*.js',
                     'Scripts/App/Common/Helpers/*.js',
                     'Scripts/App/Common/Services/*.js',
                     'Scripts/App/Controllers/*.js',
                     'Pages/Components/**/*.js'])
                .pipe(concat('app-bundle.min.js'))
                .pipe(terser({ mangle: { toplevel: true } }))
                .pipe(gulp.dest('Production/Scripts/App'));
});

// Copy vendor files.
gulp.task('build.scripts.vendor', function () {
    return gulp.src(['Scripts/Vendor/**/*.min.js',
                     'Scripts/Vendor/**/*.min.js.map'])
               .pipe(gulp.dest('Production/Scripts/Vendor'));
});

// Copy configuration files.
gulp.task('build.config', function () {
    return gulp.src(['Web.config'])
        .pipe(gulp.dest('Production'));
});

// Copy content files.
gulp.task('build.content', function () {
    return gulp.src('Content/**/*.{png,svg,gif}')
               .pipe(gulp.dest('Production/Content'));
});

// Copy style files.
gulp.task('build.css', function () {
    return gulp.src(['Styles/Styles.css',
                     'Styles/**/*.min.css'])
               .pipe(gulp.dest('Production/Styles'));
});

// Copy and modify HTML files.
gulp.task('build.html.prod', function () {
    return gulp.src(['Pages/**/*.html'])
               .pipe(htmlreplace({ application_scripts: '<script src="../Scripts/App/app-bundle.min.js"></script>' }))
               .pipe(gulp.dest('Production/Pages'));
});

// Final task for creating production version of application.
gulp.task('build.prod', gulp.parallel('build.config',
                                      'build.content',
                                      'build.css',
                                      'build.scripts.vendor',
                                      'build.scripts.prod',
                                      'build.html.prod'));