const gulp = require ('gulp');
const { series, parallel } = require('gulp');

const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const delFile = require('gulp-clean');
const uglify = require('gulp-uglify');

const htmlmin = require('gulp-htmlmin');
const cssmin = require('gulp-clean-css');
const sass = require('gulp-sass');

const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');


// Wipes everything in public directory
function cleanPub() {
    return gulp.src('./pub/**/*.*')
        .pipe(delFile());
}

// Deletes CSS in pub -- will remove any compiled SASS as well
function cleanCSS() {
    return gulp.src('./pub/css/*.css') 
        .pipe(delFile());
}

// Deletes JS in pub
function cleanJS() {
    return gulp.src('./pub/js/*.js') 
        .pipe(delFile());
}

// Deletes HTML in pub
function cleanHTML() {
    return gulp.src('./pub/*.html') 
        .pipe(delFile());
}

// Compiles all the SCSS, concats to a css file, minifies it, and sends it to public folder
function sassCompile() {
    return gulp.src('./src/sass/*.scss')
    .pipe(sass().on("error", sass.logError))
    .pipe(concat('main.css'))
    .pipe(cssmin({compatibility: 'ie8'}))
    .pipe(gulp.dest('./pub/css'))
    .pipe(browserSync.stream());
}

// Minifies and then concatenates all JS
// Now with babel support, preset env transpiles to ECMA 2015
function javascript() {
    return gulp.src('./src/js/*.js')
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['@babel/preset-env']
        }))
        .pipe(concat('main.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest('./pub/js'))
        .pipe(browserSync.stream());
}

// Moves html from source to pub
function html() {
    return gulp.src('./src/*.html')
        .pipe(htmlmin({
            collapseWhitespace: true
        }))
        .pipe(gulp.dest('./pub/'));
}

// Our watcher for live reload on public folder
function watch() {
    browserSync.init({
        server: {
            baseDir: './pub/'
        }
    });

    // I watch for SRC changes, and update public files
    gulp.watch('src/js/*.js', series(cleanJS, javascript));
    gulp.watch('src/*.html', series(cleanHTML, html));
    gulp.watch('src/sass/*.scss', series(cleanCSS, sassCompile));

    // I watch for public changes and reload browser (this will also run whenever the above code is invoked)
    gulp.watch('./pub/**').on('change', browserSync.reload);
}


exports.cleanCSS = cleanCSS;
exports.cleanJS = cleanJS;
exports.cleanHTML = cleanHTML;
exports.cleanPub = cleanPub;

exports.sassCompile = sassCompile;
exports.html = html;
exports.javascript = javascript;

exports.watch = watch;

exports.default = series(cleanPub, parallel(html, sassCompile, javascript), watch);