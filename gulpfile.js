var mkdirp = require('mkdirp');

var srcJS = './src/js/', //JS源文件目录
    destJS = './dist/js/', //JS生产目录
    srcCSS = './src/css/', //CSS源文件目录
    destCSS = './dist/css/', //CSS生产目录
    srcImage = './src/images/', //图片源文件目录
    destImage = './dist/images/', //图片生产目录
    srcHtml = './src/html/', //页面文件源文件目录
    destHtml = './dist/html'; //页面文件生产目录


var dirs = [srcJS, destJS, srcCSS, destCSS, srcImage, destImage, srcHtml, destHtml];

dirs.forEach(dir => {
    mkdirp.sync(dir);
});
/*    minifyHTML=require('gulp-minify-html'),
 runSequence = require('run-sequence'),  //执行顺序，避免*/

var gulp = require('gulp'), //本地安装gulp所用到的地方

    clean = require('gulp-clean'),//清空文件夹，避免文件冗余
    del = require('del'),
    replace = require('gulp-replace'),//文本替换
    htmlreplace=require('gulp-html-replace'),
    jshint = require('gulp-jshint'), //代码验证检查
    uglify = require('gulp-uglify'), //压缩js代码
    concat = require('gulp-concat'),//合并文件
    rename = require('gulp-rename'), //文件重命名
    notify = require('gulp-notify'), //更改提醒
    plumber=require('gulp-plumber'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('gulp-autoprefixer');
    minifycss = require('gulp-minify-css'),
    cache = require('gulp-cache'),
    imagemin = require('gulp-imagemin'),
    livereload = require('gulp-livereload'); //自动刷新页面

// Clean  任务执行前，先清除之前生成的文件
gulp.task('clean', function(cb) {
    del(['dist/css', 'dist/js', 'dist/images'], cb)
});


//replace html
gulp.task('html-replace',function() {
    return gulp.src('src/**/*.html') //源文件
        .pipe(htmlreplace())
        .pipe(gulp.dest('dist'));
});
//js代码校验、合并和压缩（类似jquery的链式操作，牛）
gulp.task('scripts', function() {
    return gulp.src('src/**/*.js') //源文件
        .pipe(jshint('.jshintrc')) //1、校验JS文件，jshint校验规则
        .pipe(jshint.reporter('default'))
        .pipe(uglify())         //3、执行压缩任务
        .pipe(gulp.dest('dist')) //压缩后文件存放位置
        .pipe(notify({    //4、操作结束后提示
            message: 'Scripts task complete'
        }));
});

//压缩css
gulp.task('minifycss', function() {
    return gulp.src('src/**/*.css')    //需要操作的文件
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'Android >= 4.0'],
            cascade: true, //是否美化属性值 默认：true 像这样：
            remove:true //是否去掉不必要的前缀 默认：true
        }))
        .pipe(minifycss())   //执行压缩
        .pipe(gulp.dest('dist/'))   //输出文件夹
        .pipe(notify({    //4、操作结束后提示
            message: 'CSS task complete'
        }));
});
// 压缩图片
gulp.task('images', function() {
    return gulp.src('src/images/**/*')
        .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
        .pipe(gulp.dest('dist/images')).pipe(notify({
            message: 'images task complete'
        }));
});

// 默认任务，这里完全可以是多个任务，比如压缩CSS，压缩图片，压缩js等
gulp.task('default',['watch'], function() {
    gulp.start('clean');
    gulp.start('html-replace');
    gulp.start('scripts');
    gulp.start('minifycss');
    gulp.start('images');
});
// 监听（前端自动化的情怀）
gulp.task('watch', function() {
    // 监听 .js文件改动，一旦改动就会自动压缩合并
    gulp.watch('src/**/*.html',['html-replace']);
    gulp.watch('src/**/*.js', ['scripts']);
    gulp.watch('src/**/*.css', ['minifycss']);
    gulp.watch('src/images/**/*', ['images']);
    // Create LiveReload server（用来自动刷新浏览器）
    livereload.listen();

    gulp.watch('src/**/*.*', function(file) {
        livereload.changed(file.path);
    });
});
