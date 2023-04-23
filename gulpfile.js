
const { src, dest, series, parallel, watch, task, lastRun } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const path = require('path');
const $ = require('gulp-load-plugins')();
const ip = require('ip');
let isProduct = false;

const setProduct = async () => {
  return isProduct = true;
}


const dir = {
  src: {
    base: './src',
    html: './src/**/!(_)*.{html,ejs}',
    scss: './src/assets/scss/**/*.scss',
    js: './src/assets/js/**/*.js',
    images: './src/assets/images/**/*',
    fonts: './src/assets/fonts/**/*',
  },
  dist: {
    base: './dist',
    css: './dist/assets/css',
    js: './dist/assets/js/',
    images: './dist/assets/images/',
  }
}

const clean = () => {
	return src(['./dist'])
		.pipe($.clean())
}

const server = async () => {
  $.connect.server({
    host: ip.address(),
    port: '1119',
    root: dir.dist.base,
    livereload: true,
  })
}

const html = async () => { 
  return src([dir.src.html])
		.pipe($.plumber())
    .pipe($.fileInclude())
    .pipe($.htmlTagInclude())
    .pipe($.ejs())
    .pipe($.prettier())
    .pipe(dest(dir.dist.base))
    .pipe($.connect.reload())
}

const scss = async () => {
  return src([dir.src.scss], {sourcemaps: true})
    .pipe($.plumber())
    .pipe($.if(!isProduct, $.sourcemaps.init()))
    .pipe(sass({
      outputStyle: 'expanded'
    })).on('error', sass.logError)
    .pipe($.if(!isProduct, $.sourcemaps.write()))
    .pipe(dest(dir.dist.css), {sourcemaps: '.'})
    .pipe($.connect.reload())
}

const image = async () => {
  return src([dir.src.images], {since: lastRun(image)})
    .pipe($.newer(dir.dist.base))
		.pipe($.cached(dir.src.base))
    .pipe(dest(dir.dist.base))
}

const watcher = async () => {
  watch([ './src/**/*.{html,ejs}' ], html)
  watch([ dir.src.scss ], scss)
}

const dev = series(html, scss, image, parallel(watcher, server));
exports.clean = series(clean);
exports.build = series(setProduct, dev);
exports.default = dev;
