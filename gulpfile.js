// плагины галпа
const gulp = require('gulp');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');
const del = require('del');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');

sass.compiler = require('node-sass');

// файлы проекта
const CSS_FILES = [
    './app/css/libs/*.css',
    './app/css/*.css'
];

const JS_FILES = [
    './app/js/libs/*.js',
    './app/js/plugins/*.js',
    './app/js/form.js',
    './app/js/calculator-test.js',
    './app/js/main.js'
];


// таск для стилей
function styles() {
    return gulp.src(CSS_FILES)

    // объединяем файлы
    .pipe(concat('style.css'))

    // добавляем префиксы
    .pipe(autoprefixer({
        overrideBrowserslist: ['last 2 versions'],
        cascade: false
    }))

    // минификация
    .pipe(cleanCSS({
        level: 2
    }))

    // перемещаем файлы
    .pipe(gulp.dest('./dist/css'))

    // обновляем страницу
    .pipe(browserSync.stream());
}

// sass to css
function sassConvert() {
    return gulp.src('./app/scss/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./app/css'));
}

// таск для скриптов
function scripts() {
    return gulp.src(JS_FILES)

    .pipe(sourcemaps.init())

    // объединяем файлы
    .pipe(concat('script.js'))

    // минификация
    .pipe(uglify({
        toplevel: true
    }))

    .pipe(sourcemaps.write('.'))

    // перемещаем файлы
    .pipe(gulp.dest('./dist/js'))

    // обновляем страницу
    .pipe(browserSync.stream());
}

// просто конкатенация скриптов для разработки
function scriptsDev() {
    return gulp.src(JS_FILES)

    .pipe(sourcemaps.init())

    // объединяем файлы
    .pipe(concat('script.js'))
    .pipe(sourcemaps.write('.'))

    // перемещаем файлы
    .pipe(gulp.dest('./dist/js'))

    // обновляем страницу
    .pipe(browserSync.stream());
}

// картинки проекта
function images() {
    return gulp.src('./app/img/**/*')
    .pipe(gulp.dest('./dist/img/'))
}

// шрифты проекта
function fonts() {
    return gulp.src('./app/fonts/**/*')
    .pipe(gulp.dest('./dist/fonts/'))
}

// html проекта
function html() {
    return gulp.src('./app/**/*.html')
    .pipe(gulp.dest('./dist/'))
}

// очистка папки
function clean() {
    return del(['dist/*'])
}

// отслеживание изменения в файлах
function watch() {
    browserSync.init({
        server: {
            baseDir: './dist/'
        }
    });

    gulp.watch('./app/scss/**/*.scss', sassConvert);
    gulp.watch('./app/css/**/*.css', styles);
    gulp.watch('./app/js/**/*.js', scriptsDev);
    gulp.watch('./app/img/**/*', images);
    gulp.watch('./app/fonts/**/*', fonts);
    gulp.watch('./app/**/*.html', html);
    
    gulp.watch('./app/**/*.html').on('change', browserSync.reload);
}

gulp.task('sassConvert', sassConvert);
gulp.task('styles', gulp.series(sassConvert, styles));
gulp.task('scripts', scripts);
gulp.task('scriptsDev', scriptsDev);
gulp.task('del', clean);
gulp.task('watch', watch);
gulp.task('fonts', fonts);
gulp.task('images', images);
gulp.task('html', html);


gulp.task('build', gulp.series(clean, gulp.parallel(html, styles, scripts, images, fonts)));
gulp.task('dev', gulp.series(clean, gulp.parallel(html, styles, scriptsDev, images, fonts), 'watch'));