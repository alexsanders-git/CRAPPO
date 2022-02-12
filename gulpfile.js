const {
    src,
    dest,
    watch,
    parallel,
    series
} = require('gulp');
const browserSync = require('browser-sync').create();
const fileInclude = require('gulp-file-include');
const scss = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const groupMedia = require('gulp-group-css-media-queries');
const cleanCSS = require('gulp-clean-css');
const rename = require('gulp-rename');
const concat = require('gulp-concat');
const minify = require('gulp-minify');
const svgSprite = require('gulp-svg-sprite');
const del = require('del');
const newer = require('gulp-newer');
const imagemin = require('gulp-imagemin');
const ttf2woff = require('gulp-ttf2woff');
const ttf2woff2 = require('gulp-ttf2woff2');
const fs = require('fs');
const babel = require('gulp-babel');

const watchFiles = () => {
    browserSync.init({
        // Инициализация Browsersync
        server: {
            baseDir: 'app/'
        }, // Указываем папку сервера
        notify: false, // Отключаем уведомления
        online: true, // Режим работы: true или false
    });

    // Мониторим файлы HTML на изменения
    watch('./src/**/*.html', html);
    // Мониторим файлы SCSS на изменения
    watch('./src/scss/**/*.scss', styles);
    // Мониторим файлы JS на изменения
    watch('./src/js/**/*.js', scripts);
    // Мониторим файлы SVG на изменения
    watch('./src/img/src/svg/**.svg', svgSprites);
    watch('./src/img/src/**.svg', svgToApp);
    // Мониторим изображения на изменения
    watch('./src/img/src/**/*.{jpg,jpeg,png}', imagesMin);
    watch('./src/img/result/**/*.{jpg,jpeg,png}', images);
    // Мониторим шрифты на изменения
    // watch('./src/fonts/*.ttf', fonts);
    // watch('./src/fonts/*.ttf', fontStyle);
};

const html = () => {
    return src(['./src/*.html', '!./src/_*.html'])
        .pipe(
            fileInclude({
                prefix: '@',
                basepath: '@file',
            })
        )
        .pipe(dest('./app'))
        .pipe(browserSync.stream());
};

const styles = () => {
    return src('./src/scss/style.scss')
        .pipe(sourcemaps.init())
        .pipe(scss({
            outputStyle: 'expanded'
        }))
        .pipe(groupMedia())
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 10 versions'],
            grid: true,
            cascade: true
        })) // Создадим префиксы с помощью Autoprefixer
        .pipe(dest('./app/css/'))
        .pipe(cleanCSS({
            level: {
                1: {
                    specialComments: 0
                }
            } /* , format: 'beautify' */
        })) // Минифицируем стили
        .pipe(rename({
            extname: '.min.css'
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(dest('./app/css/'))
        .pipe(browserSync.stream());
};

const scripts = () => {
    return src('./src/js/**/*.js')
        .pipe(concat('script.js')) // Конкатенируем в один файл
        .pipe(minify()) // Сжимаем JavaScript
        .pipe(dest('app/js/')) // Выгружаем готовый файл в папку назначения
        .pipe(browserSync.stream()) // Триггерим Browsersync для обновления страницы
};

const svgSprites = () => {
    return src('./src/img/src/svg/**.svg')
        .pipe(
            svgSprite({
                mode: {
                    stack: {
                        sprite: '../sprite.svg', //sprite file name
                        // example: true,
                    },
                },
            })
        )
        .pipe(dest('./app/img/svg/'))
        .pipe(browserSync.stream()); // Триггерим Browsersync для обновления страницы
};

const svgToApp = () => {
    return src('./src/img/src/**.svg')
        .pipe(dest('./app/img/svg/'))
        .pipe(browserSync.stream()); // Триггерим Browsersync для обновления страницы
};

const imagesMin = () => {
    return src(['./src/img/src/**/*.jpg', './src/img/src/**/*.png', './src/img/src/**/*.jpeg'])
        .pipe(newer('./src/img/result/')) // Проверяем, было ли изменено (сжато) изображение ранее
        .pipe(imagemin()) // Сжимаем и оптимизируем изображения
        .pipe(dest('./src/img/result/'))
        .pipe(browserSync.stream());
};

const images = () => {
    return src('./src/img/result/**.*')
        .pipe(dest('./app/img/'))
        .pipe(browserSync.stream());
};

// const fonts = () => {
//     src('./src/fonts/**.ttf')
//         .pipe(ttf2woff())
//         .pipe(dest('./app/fonts/'))
//     return src('./src/fonts/**.ttf')
//         .pipe(ttf2woff2())
//         .pipe(dest('./app/fonts/'));
// };

const babeljs = () => {
    return src('./app/js/script.js')
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(minify()) // Сжимаем JavaScript
        .pipe(dest('app/js/babel/')) // Выгружаем готовый файл в папку назначения
};

// Подключаем шрифты автоматически
const cb = () => { }

let srcFonts = './src/scss/_fonts.scss'
let appFonts = './app/fonts'

const fontStyle = (done) => {
    let file_content = fs.readFileSync(srcFonts);

    fs.writeFile(srcFonts, '', cb);
    fs.readdir(appFonts, function (err, items) {
        if (items) {
            let c_fontname;
            for (var i = 0; i < items.length; i++) {
                let fontname = items[i].split('.');
                fontname = fontname[0];
                if (c_fontname != fontname) {
                    fs.appendFile(srcFonts, '@include font-face ("' + fontname + '", "' + fontname + '", 400, "normal");\r\n', cb);
                }
                c_fontname = fontname;
            }
        }
    })
    done();
};
// Подключаем шрифты автоматически

const clean = () => {
    return del(['app/*']);
};

// Экспортируем функцию watchFiles() как таск watchFiles. Значение после знака = это имеющаяся функция.
exports.watchFiles = watchFiles;
// Экспортируем функцию html() в таск html
exports.html = html;
// Экспортируем функцию styles() в таск styles
exports.styles = styles;
// Экспортируем функцию scripts() в таск scripts
exports.scripts = scripts;
// Экспортируем функцию svgSprites() в таск svgSprites
exports.svgSprites = svgSprites;
// Экспортируем функцию svgToApp() в таск svgToApp
exports.svgToApp = svgToApp;
// Экспорт функции images() в таск images
exports.images = images;
// Экспорт функции imagesMin() в таск imagesMin
exports.imagesMin = imagesMin;
// Экспорт функции fonts() в таск fonts
// exports.fonts = fonts;
// Экспорт функции fontStyle() в таск fontStyle
exports.fontStyle = fontStyle;
// Экспорт функции clean() в таск clean
exports.clean = clean;

// Экспортируем дефолтный таск с нужным набором функций
exports.default = series(clean, html, scripts, svgSprites, svgToApp, imagesMin, images, fontStyle, styles, watchFiles);
// exports.default = series(clean, parallel(html, scripts, fonts, svgSprites, svgToApp, imagesMin), images, fontStyle, styles, watchFiles);

// Экспорт функции babeljs() в таск babeljs
// Babel - это транспайлер, который переписывает код современного стандарта Javascript (ES2015) в код на предыдущем стандарте ES5
exports.babeljs = babeljs;