var gulp = require("gulp");
var sass = require("gulp-sass");
var browserSync = require("browser-sync");

gulp.task("sass", function() {
  return gulp.src("web/scss/**/*.scss")
    .pipe(sass())
    .pipe(gulp.dest("web/css"))
    .pipe(browserSync.reload({
      stream: true
    }));
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
