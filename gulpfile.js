var gulp = require("gulp");
var ts = require("gulp-typescript");
var tslint = require("gulp-tslint");
var tsProject = ts.createProject("tsconfig.json");
var sourcemap = require("gulp-sourcemaps");
var mocha = require("gulp-mocha");

gulp.task("compile:resources", function () {
  return gulp.src("./app/resources/*")
    .pipe(gulp.dest("./dist/resources"));
});
  
gulp.task("compile:typescript", ["compile:resources"], function () {
  return gulp.src(["./app/src/**/*.ts"])
    .pipe(sourcemap.init())
    .pipe(tsProject())
    .pipe(sourcemap.write(".", {sourceRoot: "../app"}))
    .pipe(gulp.dest("dist"));
});

gulp.task("test", ["compile:typescript"], function () {
  return gulp.src("./test/spec/**/*.ts")
    .pipe(mocha({
    reporter: "spec",
    require: "ts-node/register"
    }));
});