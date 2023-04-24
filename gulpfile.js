
const { src, dest, series, parallel, watch, task, lastRun } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const path = require('path');
const $ = require('gulp-load-plugins')();
const ip = require('ip');
let isProduct = false;

const setProduct = async () => {
  return isProduct = true;
}


const base = {
  src: './user',
  dist: './dist',
  guide: './user/guide',
}
const dir = {
  src: {
    html: `${base.src}/**/!(_)*.{html,ejs}`,
    scss: `${base.src}/_sass/**/*.scss`,
    css: `${base.src}/**/*.css`,
    js: `${base.src}/js/**/*.js`,
    images: `${base.src}/images/**/*`,
    fonts: `${base.src}/fonts/**/*`,
  },
  guide: {
    html: `${base.guide}/**/*.html`,
    copy: `${base.guide}/**/*.{css,js}`
  },
  dist: {
    scss: `${base.dist}/_sass`,
    css: `${base.dist}`,
    js: `${base.dist}/js`,
    images: `${base.dist}/images`,
    fonts: `${base.dist}/fonts`,
    guide: `${base.dist}/guide`
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
  return src([dir.src.html, dir.guide.html])
		.pipe($.plumber())
    .pipe($.fileInclude())
    .pipe($.htmlTagInclude())
    .pipe($.ejs())
    .pipe($.prettier())
    .pipe(dest(base.dist))
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
    .pipe($.newer(base.dist))
		.pipe($.cached(dir.src.base))
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

const copyScss = async () => {
  return src([dir.src.scss]).pipe(dest(dir.dist.scss))
}
const copyCss = async () => {
  return src([dir.src.css]).pipe(dest(dir.dist.css));
}
const copyGuide = async () => {
  return src([dir.guide.copy]).pipe(dest(dir.dist.guide));
}

const watcher = async () => {
  watch([ './src/**/*.{html,ejs}' ], html)
  watch([ dir.src.scss ], scss)
}

const copy = parallel(copyCss, copyScss, copyGuide);
const webServer = parallel(watcher, server); 
const dev = series(html, scss, image, font, js, copy);
exports.clean = series(clean);
exports.copy = series(copy);
exports.build = series(setProduct, dev);
exports.default = series(dev, webServer);
