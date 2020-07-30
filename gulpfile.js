"use strict";

// load plugins

const gulp = require("gulp");
// minify css
const cssnano = require("cssnano");
// add vendor prefixes
const autoprefixer = require("autoprefixer");
// live reload
const browsersync = require("browser-sync").create();
// scss
const sass = require("gulp-sass");
// only add updated source files
const newer = require("gulp-newer");
// minify images
const imagemin = require("gulp-imagemin");
//rename files
const rename = require("gulp-rename");
// post css to handle autoprefixer and cssnano
const postcss = require("gulp-postcss");
// minify HTML
const minifyHTML = require('gulp-minify-html');
// clean up directory
const del = require('del');


// set up browser sync

function browserSync(done) {
    browsersync.init({
        server: {
            baseDir: './src/'
        },
        port: 8080
    });
    done();
}

function browserSyncReload(done) {
    browsersync.reload();
    done();
  }
  

// clean assets

function clean() {
    return del(["./src/css", "./src/assets/img"])
}

// optimize images

function images() {
    return gulp
        .src("./src/assets/img/**/*")
        .pipe(newer("./src/assets/img"))
        .pipe(
            imagemin()
        )
        .pipe(gulp.dest("./dist/assets/img"))
}

// optimize css (for build only)

function css() {
    return gulp
        .src("./src/scss/**/*.scss")
        .pipe(sass({outputStyle: "expanded"}))
        .pipe(rename({suffix: ".min"}))
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(gulp.dest("./dist/css/"))
}

// optimize css (for dev)

function cssDev() {
    return gulp
        .src("./src/scss/**/*.scss")
        .pipe(sass({outputStyle: "expanded"}))
        .pipe(rename({suffix: ".min"}))
        .pipe(gulp.dest("./src/css"))
        .pipe(browsersync.stream());
    }

// optimize HTML (for prod)

function html() {
    return gulp
        .src("./src/*.html")
        .pipe(minifyHTML())
        .pipe(rename({dirname: ''}))
        .pipe(gulp.dest("./dist/"))
        
}

// watch files

function watchAll() {
    gulp.watch("./src/scss/**/*", cssDev);
    gulp.watch("./src/assets/img/**/*", images);
    gulp.watch("./src/*.html", browserSyncReload)
}

// custom scripts

const build = gulp.series(clean, gulp.parallel(css, images, html));
const watch = gulp.parallel(watchAll, browserSync);

// export tasks to use from cmd

exports.images = images;
exports.css = css;
exports.clean = clean;
exports.build = build;
exports.watch = watch;
exports.default = build;
