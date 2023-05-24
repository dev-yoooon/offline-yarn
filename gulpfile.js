
const { src, dest, series, parallel, watch, task, lastRun } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
// const path = require('path');
const $ = require('gulp-load-plugins')();
const ip = require('ip');
let isProduct = false;

const setProduct = async () => {
  return isProduct = true;
}


const base = {
  src: './src',
  dist: './dist',
  build: './build',
}
const dir = {
  src: {
    html: `${base.src}/**/*.html`,
    scss: `${base.src}/assets/_sass/**/*.scss`,
    css: `${base.src}/assets/_sass/**/*.css`,
    js: `${base.src}/assets/js/**/*.js`,
    images: `${base.src}/assets/images/**/*`,
    fonts: `${base.src}/assets/fonts/**/*`,
  },
  dist: {
    html: `${base.dist}/**/*.html`,
    css: `${base.dist}/assets/css`,
    js: `${base.dist}/assets/js`,
    images: `${base.dist}/assets/images`,
    fonts: `${base.dist}/assets/fonts`,
  }
}

const clean = () => {
	return src([base.dist])
		.pipe($.clean())
}

const server = async () => {
  $.connect.server({
    host: ip.address(),
    port: '1119',
    root: base.dist,
    livereload: true,
  })
}

const html = async () => { 
  return src([dir.src.html])
		.pipe($.plumber())
    .pipe($.fileInclude())
    .pipe($.htmlTagInclude())
    .pipe($.ejs())
    // .pipe($.prettier())
    .pipe($.beautify.html({}))
    .pipe($.changed(base.dist, { hasChanged: $.changed.compareContents }))
    .pipe(dest(base.dist))
    .pipe($.connect.reload())
}

const prettyHtml = async () => {
  return src(dir.dist.html)
    .pipe($.prettier())
    .pipe(dest(base.build))
}

const scss = async () => {
  return src([dir.src.scss])
    .pipe($.plumber())
    .pipe($.if(!isProduct, $.sourcemaps.init()))
    .pipe(sass({
      outputStyle: 'expanded'
    })).on('error', sass.logError)
    .pipe($.prettier())
    .pipe($.if(!isProduct, $.sourcemaps.write()))
    .pipe(dest(dir.dist.css), {sourcemaps: '.'})
    .pipe($.connect.reload())
}

const image = async () => {
  return src([dir.src.images], {since: lastRun(image)})
    .pipe($.newer(base.dist))
		.pipe($.cached(base.dist))
    .pipe(dest(dir.dist.images))
}

const js = async () => {
  return src([dir.src.js])
    .pipe(dest(dir.dist.js))
}

const font = async () => {
  return src([dir.src.fonts])
    .pipe(dest(dir.dist.fonts))
}

const copyCss = async () => {
  return src([dir.src.css]).pipe(dest(dir.dist.css));
}

const guide = async () => {
  return src('src/**/*.{json,js}')
    .pipe(dest('dist/'))
}


const watcher = async () => {
  watch([ './src/**/*.{html,ejs}' ], html)
  watch([ dir.src.scss ], scss)
  watch([ dir.src.images ], image)
  watch([ dir.src.js ], js)
  watch([ 'src/**/*.{json,js}' ], guide)
}


const webServer = parallel(watcher, server); 
const dev = series(html, scss, image, font, js, copyCss);
exports.clean = series(clean);
exports.html = series(html);
exports.build = series(setProduct, dev);
exports.default = series(dev,guide, webServer);
