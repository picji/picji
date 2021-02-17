var gulp = require("gulp");
//引入插件
var cssmin = require('gulp-cssmin'); //压缩CSS
var htmlmin = require('gulp-htmlmin'); //压缩html
var uglify = require('gulp-uglify');
var pipeline = require('readable-stream').pipeline;
const imagemin = require('gulp-imagemin');
//配置任务
gulp.task("css", gulp.series(() => {
	gulp.src('./css/*.css')
		.pipe(cssmin())
		.pipe(gulp.dest('./dist/css'))
	//        {compatibility: 'ie8'}  兼容ie8
}));
gulp.task('htmlmin', gulp.series(() => {
	var options = {
		removeComments: true, //清除HTML注释
		collapseWhitespace: true, //压缩HTML
		collapseBooleanAttributes: true, //省略布尔属性的值 <input checked="true"/> ==> <input checked />
		removeEmptyAttributes: true, //删除所有空格作属性值 <input id="" /> ==> <input />
		removeScriptTypeAttributes: true, //删除<script>的type="text/javascript"
		removeStyleLinkTypeAttributes: true, //删除<style>和<link>的type="text/css"
		minifyJS: true, //压缩JS
		minifyCss: true, //压缩CSS
	};
	gulp.src('./*.html') //压缩html
		.pipe(htmlmin(options))
		.pipe(gulp.dest('./dist'));
}));
gulp.task('jsmin', gulp.series(() => {
	gulp.src('./js/*.js')
		.pipe(uglify())
		.pipe(gulp.dest('./dist/js'))
}));
gulp.task('img', gulp.series(() => {
	gulp.src('./bbq/*')
		.pipe(imagemin())
		.pipe(gulp.dest('./dist/bbq'))
}));

//注册默认任务
gulp.task('default', gulp.series("css", "htmlmin", "jsmin", "img"));
