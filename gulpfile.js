const fs = require('fs')
const gulp = require('gulp')
const postcss = require('gulp-postcss')
const sass = require('gulp-sass')(require('sass'))
const plumber = require('gulp-plumber')
const ejs = require('gulp-ejs')
const rename = require('gulp-rename')
const tailwindcss = require('tailwindcss')
const autoprefixer = require('autoprefixer')
const devServer = require('browser-sync').create()

const outputDir = 'dist'
const json = JSON.parse(fs.readFileSync('./src/json/index.json'))

const pathList = {
  ejs: {
    base: 'src/',
    file: ['./**/*.ejs', '!./**/_*.ejs'],
  },
  sass: {
    base: 'src/sass/',
    file: ['./**/style.scss'],
  },
  js: {
    base: 'src/',
    file: ['./**/js/**/*'],
  },
  images: {
    base: 'src',
    file: ['./**/images/**/*'],
  },
}

// サーバー起動
devServer.init({ port: 3200, server: { baseDir: outputDir } })

/** ビルドの設定 */
function build(done) {
  // EJS
  gulp
    .src(pathList.ejs.file, { base: pathList.ejs.base })
    .pipe(plumber()) // error handle
    .pipe(ejs({ json })) // load json & compile
    .pipe(rename({ extname: '.html' })) // rename
    .pipe(gulp.dest(outputDir)) // output
  // Sass
  gulp
    .src(pathList.sass.file, { base: pathList.sass.base })
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([require('postcss')(tailwindcss()), autoprefixer()]))
    .pipe(rename((path) => (path.dirname += '/css')))
    .pipe(gulp.dest(outputDir))
  // js
  gulp.src(pathList.js.file, { base: pathList.js.base }).pipe(gulp.dest(outputDir))
  // images
  gulp.src(pathList.images.file, { base: pathList.images.base }).pipe(gulp.dest(outputDir))
  done()
}

/** 変更を検知したらビルドする */
function watchChanged() {
  gulp.watch(['src/**/*.ejs', 'src/**/*.js', 'src/**/*.scss', 'src/**/images/**/*'], build)
}

/** ビルドを検知したらリロードする */
function watchBuild() {
  gulp.watch(['dist/**/*.html', 'dist/**/*.css'], devServer.reload())
}

// 開発環境
exports.default = gulp.series(build, gulp.parallel(watchChanged, watchBuild))
// テスト・本番環境
exports.build = gulp.series(build)
