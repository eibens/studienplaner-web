var gulp = require("gulp");
var browserSync = require("browser-sync");
var cache = require("gulp-cache");
var del = require("del");
var gulpIf = require("gulp-if");
var imagemin = require("gulp-imagemin");
var minifyCss = require("gulp-minify-css");
var runSequence = require("run-sequence");
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
    .pipe(useref())
    .pipe(gulpIf("*.css", minifyCss()))
    .pipe(gulpIf("*.js", uglify()))
    .pipe(gulp.dest("dist"));
});

gulp.task("images", function(){
  return gulp.src("web/images/**/*.+(png|jpg|jpeg|gif|svg)")
    .pipe(cache(imagemin({
      interlaced: true
    })))
    .pipe(gulp.dest("dist/images"));
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

gulp.task("clean:dist", function(callback){
  del(["dist/**/*", "!dist/images", "!dist/images/**/*"]);
  callback();
});

gulp.task("clean", function(callback) {
  del("dist");
  cache.clearAll();
  callback();
});

gulp.task("default", function(callback) {
  runSequence(["sass", "browserSync", "watch"],
    callback
  );
});

gulp.task("build", function (callback) {
  runSequence("clean:dist",
    ["sass", "useref", "images"],
    callback
  );
});
