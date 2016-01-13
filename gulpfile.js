var gulp = require("gulp");
var autoprefixer = require("gulp-autoprefixer");
var browserSync = require("browser-sync");
var cache = require("gulp-cache");
var concat = require("gulp-concat");
var csso = require("gulp-csso");
var del = require("del");
var gulpIf = require("gulp-if");
var gulpUtil = require("gulp-util");
var imagemin = require("gulp-imagemin");
var jade = require("jade");
var gulpJade = require("gulp-jade");
var minifyCss = require("gulp-minify-css");
var sass = require("gulp-sass");
var uglify = require("gulp-uglify");
var uncss = require("gulp-uncss");
var ftp = require("vinyl-ftp");

// Load custom config
function loadConfig() {
  try {
    return require("./config.json");
  }
  catch(ex) {
    if (ex.code === 'MODULE_NOT_FOUND') {
      return require("./config.default.json");
    }
  }
}

// Custom Jade filter
var markdown = require("markdown-it")({
  html: true
});
jade.filters.mymarkdown = function (text) {
  return markdown.render(text);
};

// Error handling
function handleError(err) {
  console.log(err);
  this.emit('end');
}

// Compile assets

gulp.task("build-html", function (callback) {
  gulp.src("src/jade/*.jade")
    .pipe(gulpJade({
      jade: jade,
      data: loadConfig()
    }))
    .on('error', handleError)
    .pipe(gulp.dest("build"))
    .pipe(browserSync.reload({ stream: true }));
  callback();
});

gulp.task("build-js", function (callback) {
  gulp.src([
    "src/bower_components/jquery/dist/jquery.min.js",
    "src/bower_components/Hyphenator/Hyphenator.js",
    "src/bower_components/social-share-kit/dist/js/social-share-kit.js",
    "src/js/**/*.js"
  ]).pipe(concat("scripts.js"))
    .pipe(uglify())
    .on('error', handleError)
    .pipe(gulp.dest("build/js"))
    .pipe(browserSync.reload({ stream: true }));
  callback();
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
gulp.task("build-css", function (callback) {
  gulp.src([
    "src/bower_components/social-share-kit/dist/css/social-share-kit.css",
    "src/scss/**/*.scss"
  ]).pipe(gulpIf("*.scss", sass()))
    .on('error', handleError)
    .pipe(concat("styles.css"))
    .pipe(autoprefixer({
      browsers: ["last 3 versions"],
      cascade: false
    }))
    .pipe(minifyCss())
    .pipe(csso())
    .pipe(gulp.dest("build/css"))
    .pipe(browserSync.reload({ stream: true }));
  callback();
});

gulp.task("build-images", function (callback) {
  gulp.src("src/images/**/*.+(png|jpg|jpeg|gif|svg)")
    .pipe(cache(imagemin({
      interlaced: true
    })))
    .pipe(gulp.dest("build/images"))
    .pipe(browserSync.reload({ stream: true }));
  callback();
});

gulp.task("build-fonts", function (callback) {
  gulp.src("src/bower_components/social-share-kit/dist/fonts/*")
    .pipe(gulp.dest("build/fonts"))
    .pipe(browserSync.reload({ stream: true }));
  callback();
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

// Build, serve and deploy

gulp.task("build", ["build-html", "build-css", "build-js", "build-images", "build-fonts"]);

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

gulp.task("deploy", ["build"], function () {
  var config = loadConfig();
  var conn = ftp.create({
    host:     config.ftp.host,
    user:     config.ftp.user,
    password: config.ftp.password,
    parallel: 3,
    log:      gulpUtil.log
  });
  gulp.src("build/**/*", { base: "build", buffer: false } )
    .pipe(conn.dest(config.ftp.directory));
});
