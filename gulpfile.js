var gulp = require("gulp");
var autoprefixer = require("gulp-autoprefixer");
var browserSync = require("browser-sync");
var cache = require("gulp-cache");
var csso = require("gulp-csso");
var del = require("del");
var gulpIf = require("gulp-if");
var imagemin = require("gulp-imagemin");
var minifyCss = require("gulp-minify-css");
var runSequence = require("run-sequence");
var sass = require("gulp-sass");
var uglify = require("gulp-uglify");
var uncss = require("gulp-uncss");
var useref = require("gulp-useref");

gulp.task("build-sass", function() {
  gulp.src("web/scss/**/*.scss")
    .pipe(sass())
    .pipe(gulp.dest("web/css"))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task("build-html", function(){
  gulp.src("web/*.html")
    .pipe(useref())
    .pipe(gulpIf("*.css", autoprefixer({
      browsers: ["last 3 versions"],
      cascade: false
    })))
    .pipe(gulpIf("*.css", uncss({
      html: ["web/*.html"]
    })))
    .pipe(gulpIf("*.css", minifyCss()))
    .pipe(gulpIf("*.css", csso()))
    .pipe(gulpIf("*.js", uglify()))
    .pipe(gulp.dest("build"));
});

gulp.task("build-images", function(){
  gulp.src("web/images/**/*.+(png|jpg|jpeg|gif|svg)")
    .pipe(cache(imagemin({
      interlaced: true
    })))
    .pipe(gulp.dest("build/images"));
});

gulp.task("serve", function() {
  browserSync({
    server: {
      baseDir: "web"
    }
  });
});

gulp.task("clean-fast", function(callback){
  del(["build/**/*", "!build/images", "!build/images/**/*"]);
  callback();
});

gulp.task("clean", function(callback) {
  del("build");
  cache.clearAll();
  callback();
});

gulp.task("default", function(callback) {
  runSequence(["build-sass", "serve"],
    callback
  );
  gulp.watch("web/images/**", ["build-images"]);
  gulp.watch("web/scss/**", ["build-sass"]);
  gulp.watch("web/*.html", browserSync.reload);
  gulp.watch("web/js/**", browserSync.reload);
});

gulp.task("build", function (callback) {
  runSequence("clean-fast",
    ["build-sass", "build-html", "build-images"],
    callback
  );
});
