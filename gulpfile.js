var gulp = require('gulp');
var jade = require('gulp-jade');
var babel = require('gulp-babel');
var connect = require('gulp-connect');
var path = require('path');
var browserSync = require('browser-sync').create();
var plumber = require('gulp-plumber');
var notify  = require('gulp-notify');

// ローカルサーバーの起動
gulp.task('connect', function() {
    connect.server({
        root: './',
        livereload: true
    });
});

var jadeDir = 'src/jade/';
var jadeCompileFile = [
    jadeDir + '*.jade'
];

// jadeファイルのコンパイルタスク
gulp.task('jade', function () {
    // 指定したディレクトリのjadeを回層を維持したままコンパイルする
    gulp.src(jadeCompileFile, {base: jadeDir})
        .pipe(plumber({
            errorHandler: notify.onError("Error: <%= error.message %>") // gulpをエラーで終了させず、エラーを通知する
        }))
        .pipe(jade({
            pretty: true // 整形してhtmlを作成
        }))
        .pipe(gulp.dest('.')) //  生成したhtmlを吐き出す場所
        .pipe(connect.reload());
});

var babelDir = 'src/es/';
var babelCompileFile = [
    babelDir + '*.es6',
    babelDir + '**/*.es6'
];

// es6ファイルのコンパイルタスク
gulp.task('babel', function () {
    gulp.src(babelCompileFile, {base: babelDir})
        .pipe(plumber({
            errorHandler: notify.onError("Error: <%= error.message %>") //<-
        }))
        .pipe(babel())
        .pipe(gulp.dest('./dist/js'))
        .pipe(connect.reload());
});

//  ブラウザとの同期
gulp.task('sync', ['jade', 'babel'], function() {
    browserSync.init({
        server: {
            baseDir: "./",
            index: "index.html"
        }
    });

    // 変更をチェックしてコンパイルする
    gulp.watch(jadeCompileFile, ['jade']);
    gulp.watch(babelCompileFile, ['babel']);

    // 変更をチェックしてブラウザをリロードする
    gulp.watch("*.html").on("change", browserSync.reload);
    gulp.watch("dist/js/**/*.js").on("change", browserSync.reload);
});