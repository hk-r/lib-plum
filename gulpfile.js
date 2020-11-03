let gulp = require('gulp');
let webpack = require('webpack');
let webpackStream = require('webpack-stream');
let sass = require('gulp-sass');//CSSコンパイラ
let autoprefixer = require("gulp-autoprefixer");//CSSにベンダープレフィックスを付与してくれる
let minifyCss = require('gulp-minify-css');//CSSファイルの圧縮ツール
let uglify = require("gulp-uglify");//JavaScriptファイルの圧縮ツール
let concat = require('gulp-concat');//ファイルの結合ツール
let plumber = require("gulp-plumber");//コンパイルエラーが起きても watch を抜けないようになる
let rename = require("gulp-rename");//ファイル名の置き換えを行う
let packageJson = require(__dirname+'/package.json');


// client-libs (frontend) を処理
gulp.task("client-libs", function(callback) {
	// return gulp.src(["node_modules/px2style/dist/**/*"])
	// 	.pipe(gulp.dest( './tests/app/client/libs/px2style/dist/' ))
	// ;
	callback();
});

// src 中の *.css.scss を処理
gulp.task('.css.scss', function(){
	return gulp.src("src/**/*.css.scss")
		.pipe(plumber())
		.pipe(sass({
			"sourceComments": false
		}))
		.pipe(autoprefixer())
		.pipe(rename({
			extname: ''
		}))
		.pipe(rename({
			extname: '.css'
		}))
		.pipe(gulp.dest( './res/' ))

		.pipe(minifyCss({compatibility: 'ie8'}))
		.pipe(rename({
			extname: '.min.css'
		}))
		.pipe(gulp.dest( './res/' ))
	;
});

// common.js (frontend) を処理
gulp.task("common.js", function() {
	return webpackStream({
		mode: 'development',
		entry: "./src/scripts/common.js",
		output: {
			filename: "common.js"
		},
		module:{
			rules:[
				{
					test:/\.html$/,
					use:['html-loader']
				}
			]
		}
	}, webpack)
		.pipe(plumber())
		.pipe(gulp.dest( './res/scripts/' ))
		.pipe(concat('common.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest( './res/scripts/' ))
	;
});

// ブラウザを立ち上げてプレビューする
gulp.task("preview", function(callback) {
	require('child_process').spawn('open',['http://127.0.0.1:3000/']);
	callback();
});



let _tasks = gulp.parallel(
	'client-libs',
	'common.js',
	'.css.scss'
);

// src 中のすべての拡張子を監視して処理
gulp.task("watch", function() {
	return gulp.watch(["src/**/*"], _tasks);
});

// src 中のすべての拡張子を処理(default)
gulp.task("default", _tasks);