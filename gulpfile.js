var gulp = require("gulp");
var autoprefixer = require("gulp-autoprefixer");
var browserSync = require("browser-sync");
var cache = require("gulp-cache");
var concat = require("gulp-concat");
var csso = require("gulp-csso");
var del = require("del");
var gulpIf = require("gulp-if");
var imagemin = require("gulp-imagemin");
var jade = require("gulp-jade");
var minifyCss = require("gulp-minify-css");
var sass = require("gulp-sass");
var uglify = require("gulp-uglify");
var uncss = require("gulp-uncss");

// Compile assets

gulp.task("build-html", function (callback) {
  gulp.src("src/jade/**/*.jade")
    .pipe(jade())
    .pipe(gulp.dest("build"))
    .pipe(browserSync.reload({ stream: true }));
  callback();
});

gulp.task("build-js", function () {
  gulp.src([
    "src/bower_components/jquery/dist/jquery.min.js",
    "src/bower_components/Hyphenator/Hyphenator.js",
    "src/bower_components/wow/dist/wow.js",
    "src/js/**/*.js"
  ]).pipe(concat("scripts.js"))
    .pipe(uglify())
    .pipe(gulp.dest("build"))
    .pipe(browserSync.reload({ stream: true }));
});

// FIXME: Pipe through Uncss
// Uncss depends on the compiled HTML files. If we use Uncss here we have to
// run "build-html" first. This is bad since browser-sync will reload the page
// when the HTML changes instead of just injecting the CSS. Maybe use a second
// task "build-css-uncss" that adds Uncss to the process and is only called
// in the "build" task.
//
//     .pipe(uncss({
//       html: ["src/*.html"],
//       ignore: [".animated"]
//     }))
//
gulp.task("build-css", function () {
  gulp.src([
    "src/bower_components/wow/css/libs/animate.css",
    "src/scss/**/*.scss"
  ]).pipe(gulpIf("*.scss", sass()))
    .pipe(concat("styles.css"))
    .pipe(autoprefixer({
      browsers: ["last 3 versions"],
      cascade: false
    }))
    .pipe(minifyCss())
    .pipe(csso())
    .pipe(gulp.dest("build"))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task("build-images", function () {
  gulp.src("src/images/**/*.+(png|jpg|jpeg|gif|svg)")
    .pipe(cache(imagemin({
      interlaced: true
    })))
    .pipe(gulp.dest("build/images"))
    .pipe(browserSync.reload({ stream: true }));
});

// Clean project

gulp.task("clean-fast", function (callback) {
  del(["build/**/*", "!build/images", "!build/images/**/*"]);
  callback();
});

gulp.task("clean", function (callback) {
  del("build");
  cache.clearAll();
  callback();
});

// Build and serve

gulp.task("build", ["build-html", "build-css", "build-js", "build-images"]);

gulp.task("default", ["build"], function () {
  browserSync({
    server: {
      baseDir: "build"
    }
  });
  gulp.watch("src/images/**", ["build-images"]);
  gulp.watch("src/jade/**", ["build-html"]);
  gulp.watch("src/js/**", ["build-js"]);
  gulp.watch("src/scss/**", ["build-css"]);
});
