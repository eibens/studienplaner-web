var gulp = require("gulp");
var browserSync = require("browser-sync");
var gulpIf = require("gulp-if");
var minifyCss = require("gulp-minify-css");
var sass = require("gulp-sass");
var uglify = require("gulp-uglify");
var useref = require("gulp-useref");

gulp.task("sass", function() {
  return gulp.src("web/scss/**/*.scss")
    .pipe(sass())
    .pipe(gulp.dest("web/css"))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task("useref", function(){
  return gulp.src("web/*.html")
    .pipe(gulpIf("*.css", minifyCss()))
    .pipe(gulpIf("*.js", uglify()))
    .pipe(useref())
    .pipe(gulp.dest("dist"));
});

gulp.task("browserSync", function() {
  browserSync({
    server: {
      baseDir: "web"
    }
  });
});

gulp.task("watch", ["browserSync", "sass"], function(){
  gulp.watch("web/scss/**/*.scss", ["sass"]);
  gulp.watch("web/*.html", browserSync.reload);
  gulp.watch("web/js/**/*.js", browserSync.reload);
});
