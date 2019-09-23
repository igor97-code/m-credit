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
    './src/css/libs/*.css',
    './src/css/*.css'
];

const JS_FILES = [
    './src/js/libs/*.js',
    './src/js/plugins/*.js',
    './src/js/form.js',
    './src/js/calculator-test.js',
    './src/js/main.js'
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
    .pipe(gulp.dest('./build/css'))

    // обновляем страницу
    .pipe(browserSync.stream());
}

// sass to css
function sassConvert() {
    return gulp.src('./src/scss/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./src/css'));
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
    .pipe(gulp.dest('./build/js'))

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
    .pipe(gulp.dest('./build/js'))

    // обновляем страницу
    .pipe(browserSync.stream());
}

// картинки проекта
function images() {
    return gulp.src('./src/img/**/*')
    .pipe(gulp.dest('./build/img/'))
}

// шрифты проекта
function fonts() {
    return gulp.src('./src/fonts/**/*')
    .pipe(gulp.dest('./build/fonts/'))
}

// очистка папки
function clean() {
    return del(['build/*'])
}

// отслеживание изменения в файлах
function watch() {
    browserSync.init({
        server: {
            baseDir: './'
        }
    });

    gulp.watch('./src/scss/**/*.scss', sassConvert);
    gulp.watch('./src/css/**/*.css', styles);
    gulp.watch('./src/js/**/*.js', scriptsDev);
    gulp.watch('./src/img/**/*', images);
    gulp.watch('./src/fonts/**/*', fonts);
    
    gulp.watch("./*.html").on('change', browserSync.reload);
}

gulp.task('sassConvert', sassConvert);
gulp.task('styles', gulp.series(sassConvert, styles));
gulp.task('scripts', scripts);
gulp.task('scriptsDev', scriptsDev);
gulp.task('del', clean);
gulp.task('watch', watch);
gulp.task('fonts', fonts);
gulp.task('images', images);


gulp.task('build', gulp.series(clean, gulp.parallel(styles, scripts, images, fonts)));
gulp.task('dev', gulp.series(clean, gulp.parallel(styles, scriptsDev, images, fonts), 'watch'));