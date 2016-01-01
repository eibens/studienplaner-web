var gulp = require("gulp");
var sass = require("gulp-sass");

gulp.task("sass", function() {
  return gulp.src("web/scss/**/*.scss")
    .pipe(sass())
    .pipe(gulp.dest("web/css"))
});

gulp.task("watch", function(){
  gulp.watch("web/scss/**/*.scss", ["sass"]);
});
