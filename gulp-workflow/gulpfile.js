// gulp
const {src, dest, watch, series, parallel} = require('gulp');
const fileInclude = require('gulp-file-include'); // include html as file in html
const rimraf = require('rimraf');
const useref = require('gulp-useref');
const mode = require('gulp-mode')(); // default mode is development

// markup
const htmlmin = require('gulp-htmlmin');

// styles
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const sass = require('gulp-sass')(require('sass'));

// images
const imageMin = require('gulp-imagemin'); 

// scripts
const webpack = require('webpack-stream');

// dev server and live reloading
const browserSync = require('browser-sync').create();

// file paths
const filePath = {
    input: 'src/',
    output: 'dist/',
    markup: {
        index: 'src/index.html',
        pages: 'src/pages/**/*.html',
        outputIndex: 'dist/',
        outputPages: 'dist/pages/'
    },
    styles: {
        input: 'src/styles/**/*.{sass,scss}',
        output: 'dist/styles/'
    },
    images: {
        input: 'src/assets/images/**/*.{png,svg,jpg,jpeg,gif}',
        output: 'dist/assets/images/'
    },
    scripts: {
        input: 'src/js/main.js',
        output: 'dist/js/'
    },
    watch: 'src/**/*'
}

// log message
function LogMessage(done) {
    console.log('Running Gulp...');
    return done();
}

// clean output dir
function Clean(done) {
    rimraf(filePath.output, done);
}

// gulp file include in html files, minify on production & copy markup
function Markup(done) {
    src([filePath.markup.index])
    // including src/layouts markup into index and pages markup files
    .pipe(fileInclude({
        prefix: '@@',
        basepath: '@file'
    }))
    // change references to files for build
    .pipe(useref({noAssets: true}))
    // minify on production
    .pipe(mode.production(htmlmin(
        { collapseWhitespace: true, removeComments: true }
    )))
    .pipe(dest(filePath.markup.outputIndex));

    function MarkupPages(done) {
        src([filePath.markup.pages])
        // including src/layouts markup into index and pages markup files
        .pipe(fileInclude({
            prefix: '@@',
            basepath: '@file'
        }))
        // change references to files for build
        .pipe(useref({noAssets: true}))
        // minify on production
        .pipe(mode.production(htmlmin(
            { collapseWhitespace: true, removeComments: true }
        )))
        .pipe(dest(filePath.markup.outputPages));
        return done;
    }

    MarkupPages();
    return done();
}

// sass compile, autoprefixer, minify on production & copy css
function Css(done) {
    const pluginsDev = [
        autoprefixer()
    ];
    const pluginsProd = [
        cssnano()
    ]
    src(filePath.styles.input)
    // sass compile
    .pipe(sass().on('error', sass.logError))
    // autoprefixer
    .pipe(postcss(pluginsDev))
    // minify on production
    .pipe(mode.production(postcss(pluginsProd)))
    .pipe(dest(filePath.styles.output));
    return done();
}

// function Test(done) {
//     src('src/test/*.{png,svg,jpg,jpeg,gif}')
//     .pipe(dest('dist/test/'));
//     return done();
// }

// optimize images on production & copy images
function Images(done) {
    src(filePath.images.input)
    // optimize images on production
    .pipe(mode.production(imageMin()))
    .pipe(dest(filePath.images.output));
    return done();
}

// transpile, bundle, minify on production & copy scripts
function Scripts(done) {
    src(filePath.scripts.input)
    .pipe(webpack({
        // switch mode to 'production/development' for production/development builds
        mode: 'production',
        // switch devtool to 'source-map/eval' for production/development builds
        devtool: 'source-map',
        entry: './src/js/main.js',
        output: {
          filename: '[name].js',
          clean: true,
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    loader: 'esbuild-loader',
                    options: {
                    target: 'es2015'
                    }
                },
            ]
          },
      }))
    .pipe(dest(filePath.scripts.output))
    .pipe(browserSync.stream({stream: 'true'}));
    return done();
}

// start http server with browserSync
function HttpServer(done) {
    browserSync.init({
        server: {
            baseDir: filePath.output,
            // set port exclusively
            // port: 
        },
        open: true,
        notify: false,
    });
    return done();
}

// reload the browser with browserSync
function LiveReload(done) {
    browserSync.reload();
    return done();
}

// watch src dir for changes
function WatchSrc(done) {
    watch(filePath.watch, parallel(Markup, Css, Images, Scripts, LiveReload));
    return done();
}

// for development build run 'yarn dev'
// for production build run 'yarn prod'
module.exports.default = series(LogMessage, Clean,
    parallel(Markup, Css, Images, Scripts, HttpServer, WatchSrc));