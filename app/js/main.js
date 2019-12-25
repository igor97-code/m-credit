$(function () {
    //Открыть и закрыть контент на странице, быстрый приятный скрипт 

    $('.button-hidden-content').click(function() {
        $('.hidden-content').slideToggle('active');
        $('.button-hidden-content a').toggle();
    });

    // console.log(0);
    // обновление класса HTML в зависимости от высота вьюпорта
    refreshHeightClass();

    // переключение меню
    $('body').on('click', '.toggle-mobile-menu', function () {
        $('html').toggleClass('open-mobile-menu');
        return false;
    });

    initPlaceholders();
    initMask();

    $('select').styler({
        selectSmartPositioning: false,
        selectSearch: false,
        onSelectOpened: function () {
            // $(this).parents('.field').removeClass('error success empty');
            $(this).find('.jq-selectbox__dropdown ul').jScrollPane();
        }
    });

    $('.input-file').styler({
        filePlaceholder: 'Прикрепить файл'
    });

    // lazyload
    $('.lazy').Lazy({
        effect: 'fadeIn',
        effectTime: 2000,
        // afterLoad: function(element) {
        //     // called after an element was successfully handled
        // },
    });

    $(window).on('resize', function () {
        resizeModal();
    });

    // основной слайдер на главной
    if ($('#main_slider').length) {
        initMainSlider();
    }

    // слайдер продуктов
    if ($('#products_slider').length) {
        initProductsSlider();
    }

    // слайдер инфографики
    if ($('#infographic_slider').length) {
        initInfographicSliderInMain();
    }

    // слайдер отзывов
    if ($('#comments_slider').length) {
        initCommentsSlider();
    }

    // слайдер отзывов
    if ($('#experts_slider').length) {
        initExpertsSliderInMain();
    }

    //Сео слайдер макбук

    if ($('#macbook_slider').length) {
        initSeoMacbookSlider();
    }

    if ($('.how-invest-mini-calc')) {
        initInvestors();
    }

    // читать полностью
    if ($('.show-more').length) {
        $('.show-more').on('click', function () {
            var $this = $(this);

            $this.fadeOut('fast');

            $this.parents('.section').find('.more-mobile-content').removeClass('more-mobile-content');

            return false
        })
    }

    // инициализация калькуляторов
    initCalculators();

    // форма обратной связи
    initFeedbackForm();

    // вкладки
    $('body')
        .on('click', '.switches .switch', function () {
            var tab = $(this).attr('data-tab');
            if ($(this).hasClass('active')) {
                closeTab(tab);

            } else {
                openTab(tab);
            }
            return false;
        })
        .on('click', '.close-tab-button', function () {
            var tab = $(this).parents('.tab').attr('data-tab');
            closeTab(tab);
            return false;
        });

    // спойлер
    $('body').on('click', '.toggle-button', function () {
        $(this).parents('.toggle-block').toggleClass('open');
        return false;
    });

    //login 
    if ($('#authpage')) {
        initAuthPage();
    }

    // скрываем прелоадер страницы
    $('#page_preloader').hide('fade', 400);
});


// обновление классов в зависимости от высоты viewport
function refreshHeightClass() {
    refresh();

    $(window).on('resize', function () {
        refresh();
    });

    function refresh() {
        var viewportHeight = +$(window).height();

        if (viewportHeight < 800) {
            $('html').addClass('height-medium');
        } else {
            $('html').removeClass('height-medium');
        }

        if (viewportHeight < 700) {
            $('html').addClass('height-small');
        } else {
            $('html').removeClass('height-small');
        }
    }
}

function initFeedbackForm() {
    var $form = $('#support_form'),
        $feedbackType = $form.find('#feedback_type'),
        $feedbackQuestionType = $('#feedback_question_type'),
        $feedbackThemeField = $form.find('#feedback_theme_field'),
        $feedbackFileList = $form.find('#feedback_file_list'),
        $supportSuccess = $('#support_success');

    $feedbackType.on('change', function () {
        if ($(this).val() === '5') {
            $feedbackThemeField.removeClass('hide');

        } else {
            $feedbackThemeField.addClass('hide');
            $feedbackQuestionType.val('').trigger('refresh').trigger('blur');
        }
    });

    // добавление файлов
    var fileCount = 1,
        fileCountMax = 3;

    $form.on('change', '.feedback-file', function () {
        if (!$(this).val()) return false;

        if (fileCount >= fileCountMax) return false;

        var fileHTML = '<div class="col w-50"><div class="field for-file"><input type="file" name="feedback_file[]" class="input-file feedback-file" accept=".txt,.rftm,.doc,.docx,.jpg,.png"></div></div>';
        if (fileCount === 2) fileHTML += '<div class="clr"></div>';

        $feedbackFileList.append(fileHTML);
        $feedbackFileList.find('.feedback-file').last().styler({
            filePlaceholder: 'Прикрепить файл'
        });

        fileCount++;
    });
    $('#support_wrapper').on('change', '.feedback_file', function () {
        if ($(this).val() !== '') {
            // проверка на кол-во
            if ($('input.feedback_file').length < 3) {
                var br = $('<br>');
                var file = $('<input type="file" name="feedback_file[]" id="feedback_file" class="feedback_file">');
                $('#support_wrapper .form-wrapper .fields-wrapper .field.file').append(br).append(file);
                file.styler({
                    filePlaceholder: 'Прикрепить файл'
                });
            };
        };
    });

    // отслеживаем изменения в валидируемых полях
    $form.on('change', 'input, select, textarea', function () {
        validateField($(this));
    });


    // отправка формы
    $form.on('submit', function () {
        if (validateForm($form)) {
            var formData = new FormData($supportForm);

            var xhr = new XMLHttpRequest();
            xhr.open('POST', '/mail/');

            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        data = xhr.responseText;
                    }
                }
            };

            xhr.send(formData);

            $supportForm.addClass('hide');
            $supportSuccess.removeClass('hide');
        }
        return false;
    });
}

//ф-я центрирования контента модального окна
function resizeModal() {
    if ($('.modal-window:visible').length) {
        var viewportHeight = +$(window).height(),
            $modal = $('.modal-window:visible'),
            $modalContent = $modal.find('.modal-content'),
            modalHeight = $modalContent.height() * 1 + 60;

        var marginModal = 30;
        var diff = viewportHeight - modalHeight;
        if (diff > 60) {
            marginModal = diff / 2;
        }

        $modalContent.css({
            'marginTop': marginModal
        });
    }
}

// калькулятор займов
function initCalculators() {
    var $calculators = $('[data-calculator]');
    if (!$calculators.length) return;

    // данные калькулятора для расчетов
    var calculatorData = calculatorTestData;
    setTimeout(function () {
        $calculators.each(function () {
            init($(this));
        });
    }, 1500);

    $.ajax({
        url: 'https://migcredit.ru/ajax/calc2.php',
        success: function (data) {
            calculatorData = data;
            $calculators.each(function () {
                init($(this));
            });
        }
    });

    function init($calculator) {
        // основные HTML элементы
        var $term = $calculator.find('[data-term]'),
            $termLabel = $calculator.find('[data-term_label]'),
            $termMin = $calculator.find('[data-term_min]'),
            $termMinLabel = $calculator.find('[data-term_min_label]'),
            $termMax = $calculator.find('[data-term_max_label]'),
            $termMaxLabel = $calculator.find('[data-term_max_label]'),
            $sum = $calculator.find('[data-sum]'),
            $sumMin = $calculator.find('[data-sum_min]'),
            $sumMax = $calculator.find('[data-sum_max]'),
            $resultDeadline = $calculator.find('[data-result_deadline]'),
            $resultSum = $calculator.find('[data-result_sum]'),
            $resultSumLabel = $calculator.find('[data-result_sum_label]'),
            $termType = $calculator.find('[data-term_type]');

        var defaultSumMin = +calculatorData.setting.sum_min,
            defaultSumMax = +calculatorData.setting.sum_max,
            defaultSumCur = +calculatorData.setting.sum_cur;

        $sumMin.html(numberFormat(defaultSumMin));
        $sumMax.html(numberFormat((defaultSumMax + 2000)));
        $sum.html(numberFormat(defaultSumCur));

        var termSliderMax = calculatorData.item[defaultSumCur].data.length * 1 + 1,
            termSliderValue = Math.round(termSliderMax / 2);

        var term = termSliderValue;

        var typeCalculator = calculatorData.item[defaultSumCur].data[term].term_type;

        //строка для сравнения - нужна для переинициализации ползунка периода
        var strSlider = '';

        $termType.val(typeCalculator);

        var $sumSlider = $calculator.find('[data-sum_slider]').slider({
            range: 'min',
            value: defaultSumCur,
            min: defaultSumMin,
            max: defaultSumMax,
            step: 1000,
            slide: function (event, ui) {
                $sum.html(numberFormat(ui.value));
                calculate();
            }
        });

        var $termSlider = $calculator.find('[data-term_slider]').slider({
            range: 'min',
            value: termSliderValue,
            min: 0,
            max: termSliderMax,
            step: 1,
            slide: function (event, ui) {
                term = ui.value;

                //подпись и значение для текущего периода
                var termValue = calculatorData.item[$sumSlider.slider('value')].data[ui.value].term,
                    termLabel = calculatorData.item[$sumSlider.slider('value')].data[ui.value].term_type_ru;

                $termLabel.html(termLabel);
                $term.html(termValue);

                typeCalculator = calculatorData.item[$sumSlider.slider('value')].data[ui.value].term_type;
                calculate();
            }
        });

        calculate();

        $calculator.removeClass('load');

        function calculate() {
            var sum = getClearVal($sum.text());

            //в случае если изменяется период для суммы - переинициализация ползунков
            var strSliderNew = calculatorData.item[sum].str;
            if (strSliderNew != strSlider) {
                strSlider = strSliderNew;

                var sliderTermMin = 0,
                    sliderTermMax = calculatorData.item[sum].data.length * 1 - 1,
                    sliderTermValue = Math.round(sliderTermMax / 2) + 1;

                term = sliderTermValue;

                typeCalculator = calculatorData.item[sum].data[term].term_type;
                $termType.val(typeCalculator);

                //подписи для min/max значения периода
                var termLabelMin = calculatorData.item[sum].data[0].term_type_ru,
                    termMin = calculatorData.item[sum].data[0].term;

                $termMin.html(termMin);
                $termMinLabel.html(termLabelMin);

                var termLabelMax = calculatorData.item[sum].data[sliderTermMax].term_type_ru,
                    termMax = calculatorData.item[sum].data[sliderTermMax].term;

                $termMax.html(termMax);
                $termMaxLabel.html(termLabelMax);

                //подпись и значение для текущего периода
                var termValue = calculatorData.item[sum].data[term].term,
                    termLabel = calculatorData.item[sum].data[term].term_type_ru;

                $term.val(termValue);
                $termLabel.html(termLabel);

                //переинициализация позунка периода
                //обновляем max/value
                $termSlider.slider('option', {
                    min: 0,
                    max: sliderTermMax,
                    value: sliderTermValue
                });

            }


            // подпись к сумме
            var labelReturn = 'Платеж раз в 2 недели';
            if (typeCalculator === 'day') {
                labelReturn = 'Возвращаете';
            }
            $resultSumLabel.html(labelReturn);

            //сумма возврата/сумма со скидкой
            var payment = +calculatorData.item[sum].data[term].payment,
                discount = +calculatorData.item[sum].data[term].discount;

            if (discount) payment = discount;

            $resultSum.html(numberFormat(payment));

            //дата возврата
            var deadline = calculatorData.item[sum].data[term].deadline;
            $resultDeadline.html(deadline);
        }
    }

}

//денежный формат
function numberFormat(number, decimals, decPoint, thousandsSep) {
    if (!decimals) decimals = 0;
    if (!decPoint) decPoint = '';
    if (!thousandsSep) thousandsSep = ' ';

    var i, j, kw, kd, km;
    if (isNaN(decimals = Math.abs(decimals))) {
        decimals = 2;
    }
    if (decPoint == undefined) {
        decPoint = ',';
    }
    if (thousandsSep == undefined) {
        thousandsSep = '.';
    }
    i = parseInt(number = (+number || 0).toFixed(decimals)) + '';
    if ((j = i.length) > 3) {
        j = j % 3;
    } else {
        j = 0;
    }
    km = (j ? i.substr(0, j) + thousandsSep : '');
    kw = i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thousandsSep);
    kd = (decimals ? decPoint + Math.abs(number - i).toFixed(decimals).replace(/-/, 0).slice(2) : '');
    return km + kw + kd;
}

//фукнция склонения
function declOfNum(number, titles) {
    var cases = [2, 0, 1, 1, 1, 2];
    return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
}

// открытие|закрытие вкладок
function openTab(tab) {
    $('[data-tab]').removeClass('active');
    $('[data-tab="' + tab + '"]').addClass('active');
}

function closeTab(tab) {
    $('[data-tab="' + tab + '"]').removeClass('active');
}


// слайдер на главной
function initMainSlider() {
    new Swiper('#main_slider', {
        effect: 'fade',
        loop: true,
        preloadImages: false,
        lazy: true,
        pagination: {
            el: '.main-slider-pagination',
            type: 'bullets',
            clickable: true
        },
        navigation: {
            nextEl: '.main-slider-button-next',
            prevEl: '.main-slider-button-prev'
        },
        nextSlideMessage: '',
        prevSlideMessage: '',
        autoplay: {
            delay: 5000,
        }
    });
}

// слайдер продуктов
function initProductsSlider() {
    var slider = new Swiper('#products_slider', {
        effect: 'slide',
        loop: false,
        slidesPerView: 3,
        watchSlidesVisibility: true,
        spaceBetween: 20,
        // slidesOffsetBefore: 20,
        // slidesOffsetAfter: 20,
        navigation: {
            nextEl: '.products-slider-button-next',
            prevEl: '.products-slider-button-prev'
        },
        nextSlideMessage: '',
        prevSlideMessage: '',
        breakpoints: {
            1000: {
                slidesPerView: 'auto',
                freeMode: true,
                spaceBetween: 10
            }
        }
    });
}

// слайдер инфографики
function initInfographicSliderInMain() {
    var slider = new Swiper('#infographic_slider', {
        effect: 'slide',
        loop: false,
        slidesPerView: 3,
        spaceBetween: 20,
        slidesPerGroup: 3,
        // slidesPerColumn: 1,
        pagination: {
            el: '.infographic-slider-pagination',
            type: 'bullets',
            clickable: true
        },
        navigation: {
            nextEl: '.infographic-slider-button-next',
            prevEl: '.infographic-slider-button-prev'
        },
        nextSlideMessage: '',
        prevSlideMessage: '',
        breakpoints: {
            575: {
                slidesPerView: 2,
                spaceBetween: 10,
                slidesPerGroup: 2,
                // slidesPerColumn: 3,
                // pagination: false,
                // noSwipingClass: 'swiper-slide',
                // noSwiping: true
            }
        }
    });
}

// слайдер отзывов
function initCommentsSlider() {
    var slider = new Swiper('#comments_slider', {
        effect: 'slide',
        loop: false,
        watchSlidesVisibility: true,
        spaceBetween: 20,
        // slidesOffsetBefore: 20,
        // slidesOffsetAfter: 20,
        pagination: {
            el: '.comments-slider-pagination',
            type: 'bullets',
            clickable: true
        },
        navigation: {
            nextEl: '.comments-slider-button-next',
            prevEl: '.comments-slider-button-prev'
        },
        nextSlideMessage: '',
        prevSlideMessage: '',
        // breakpoints: {
        //     1000: {
        //         spaceBetween: 10
        //     }
        // }
    });
}

// слайдер экспертов
function initExpertsSliderInMain() {
    var slider = new Swiper('#experts_slider', {
        effect: 'slide',
        loop: false,
        slidesPerView: 3,
        spaceBetween: 20,
        watchSlidesVisibility: true,
        noSwipingClass: 'swiper-slide',
        noSwiping: true,
        pagination: {
            el: '.experts-slider-pagination',
            type: 'bullets',
            clickable: true,
        },
        navigation: {
            nextEl: '.experts-slider-button-next',
            prevEl: '.experts-slider-button-prev'
        },
        nextSlideMessage: '',
        prevSlideMessage: '',
        breakpoints: {
            1000: {
                slidesPerView: 2,
                spaceBetween: 20,
                noSwiping: false,
            },
            575: {
                slidesPerView: 1,
                spaceBetween: 20,
                noSwiping: false,
            }
        }
    });
}

// Seo macbook
function initSeoMacbookSlider() {
    new Swiper('#macbook_slider', {
        effect: 'fade',
        loop: true,
        preloadImages: false,
        lazy: true,
        pagination: {
            el: '.macbook-slider-pagination',
            type: 'bullets',
            clickable: true
        },
        nextSlideMessage: '',
        prevSlideMessage: '',
    });
}
$(function () {
    if ($('[data-tabs-block]').length) {
        $('[data-tabs-block]').each(function () {
            initTabs($(this));
        })
    }
});


function initTabs($tabs) {
    if (!$tabs) return;

    var defaultTab = $tabs.attr('data-default-tab');
    if (!defaultTab) {
        defaultTab = $tabs.find('[data-tab]').first().attr('data-tab');
    }

    changeTab(defaultTab);

    $tabs.on('click', '.switch', function () {
        if ($(this).hasClass('active')) return false;

        changeTab($(this).attr('data-tab'));

        return false;
    });

    function changeTab(tab) {
        $tabs.find('[data-tab]').removeClass('active');
        $tabs.find('[data-tab="' + tab + '"]').addClass('active');
    }
}

//Инвестиции

function initInvestors() {
    $('.circles').on('click', '.item', function () {
        $(this).addClass('active').siblings().removeClass('active');

        var month = +$(this).attr('data-month');
        $('[data-circle-percent]').text(investorData['item'][month]['percent']);

        return false;
    });

    initInvestorCalculator();

    initInvestorForm();

    $('.circles .item[data-active]').trigger('click');
}

//Калькулятор инвестиций
function initInvestorCalculator() {
    var $calculators = $('[data-invest-calculator]');
    if (!$calculators.length) return;

    // данные калькулятора для расчетов
    var calculatorData = investorData;

    setTimeout(function () {
        $calculators.each(function () {
            init($(this));
        });
    }, 1500);


    function init($calculator) {
        // основные HTML элементы
        var $term = $calculator.find('[data-term]'),
            $termLabel = $calculator.find('[data-term_label]'),
            $termMin = $calculator.find('[data-term_min]'),
            $termMinLabel = $calculator.find('[data-term_min_label]'),
            $termMax = $calculator.find('[data-term_max_label]'),
            $termMaxLabel = $calculator.find('[data-term_max_label]'),
            $sum = $calculator.find('[data-sum]'),
            $sumMin = $calculator.find('[data-sum_min]'),
            $sumMax = $calculator.find('[data-sum_max]'),
            $resultSum = $calculator.find('[data-result_sum]'),
            $resultPercent = $calculator.find('[data-result_percent]');

        var defaultSumMin = +calculatorData.setting.sum_min,
            defaultSumMax = +calculatorData.setting.sum_max,
            defaultSumCur = +calculatorData.setting.sum_cur,
            defaultMonth = +calculatorData.setting.month_cur;

        $sumMin.html(numberFormat(defaultSumMin));
        $sumMax.html(numberFormat((defaultSumMax)));
        $sum.html(numberFormat(defaultSumCur));
        $term.html(calculatorData['item'][defaultMonth]['month']);
        $termLabel.html(calculatorData['item'][defaultMonth]['term_name']);
        $resultPercent.html(calculatorData['item'][defaultMonth]['percent']);

        var $sumSlider = $calculator.find('[data-sum_slider]').slider({
            range: 'min',
            value: defaultSumCur,
            min: defaultSumMin,
            max: defaultSumMax,
            step: 10000,
            slide: function (event, ui) {
                $sum.html(numberFormat(ui.value));
                calculate();
            }
        });

        var $termSlider = $calculator.find('[data-term_slider]').slider({
            range: 'min',
            value: defaultMonth,
            min: 0,
            max: 3,
            step: 1,
            slide: function (event, ui) {
                $term.html(calculatorData['item'][ui.value]['month']);
                $termLabel.html(calculatorData['item'][ui.value]['term_name']);
                $resultPercent.html(calculatorData['item'][ui.value]['percent']);
                calculate();
            }
        });

        calculate();

        $calculator.removeClass('load');

        function calculate() {
            var sum = getClearVal($sum.text()),
                term = getClearVal($term.text()),
                percent = getClearVal($resultPercent.text());

            var calculated = (sum / 100 * percent) / (12 / term);

            $resultSum.html(numberFormat(calculated));
            console.log(calculated);
        }

    }

}

//Форма инвестиций

function initInvestorForm() {
    var $form = $('#invest_callme');

    $form.on('change', 'input', function () {
        validateField($(this));
    });

    $form.on('click', '.button-form', function () {
        if (!$(this).hasClass('disabled')) {
            if (validateForm($form)) {
                $(this).addClass('disabled');
                var name = $('.input-invest[name="name"]').val();
                var email = $('.input-invest[name="email"]').val();
                var phone = $('.input-invest[name="phone"]').val();

                var invest_utm_source = $('#invest_utm_source').val();
                var invest_utm_medium = $('#invest_utm_medium').val();
                var invest_utm_campaign = $('#invest_utm_campaign').val();
                var invest_lid = $('#invest_lid').val();
                var invest_aid = $('#invest_aid').val();
                var invest_wmid = $('#invest_wmid').val();
                var invest_tid = $('#invest_tid').val();

                phone = phone.replace(/[()\_-\s]/g, '');
                var data = {
                    'name': name,
                    'email': email,
                    'phone': phone,
                    'invest_utm_source': invest_utm_source,
                    'invest_utm_medium': invest_utm_medium,
                    'invest_utm_campaign': invest_utm_campaign,
                    'invest_lid': invest_lid,
                    'invest_aid': invest_aid,
                    'invest_wmid': invest_wmid,
                    'invest_tid': invest_tid
                };
                $.ajax({
                    url: '/dlya-investora/ajax.php',
                    type: 'POST',
                    dataType: 'json',
                    data: data,
                    success: function (data) {
                        yaCounter16671268.reachGoal('button_invest');
                        successForm();
                    },
                    error: function (data) {
                        errorForm();
                    },
                    timeout: 60000
                });
            }
        }
        return false;
    });


    function successForm() {
        $('.success-text').html('Сообщение успешно отправлено!');
        $('.success-form').fadeIn('fast');
        setTimeout(function () {
            clearForm($form);
            $('.success-form').fadeOut('fast');
            $('#invest_callme .btn-submit').removeClass('disabled');
        }, 2000);
    }

    function errorForm() {
        $('.success-text').html('Ошибка!');
        $('.success-form').fadeIn('fast');
        setTimeout(function () {
            clearForm($form);
            $('.success-form').fadeOut('fast');
            $('#invest_callme .btn-submit').removeClass('disabled');
        }, 2000);
    }
}

if ($('[data-contacts-map]').length) {
    $('[data-contacts-map]').each(function (i) {
        initContactsMap($(this));
    })
}


function initContactsMap($map) {
    if (!$map) return;
    ymaps.ready(init);


    var $balloons = $map.find('.item');



    function init() {
        var id = $map.attr('id');

        var map = new ymaps.Map(id, {
            center: [53.197518, 50.129022],
            zoom: 12,
            controls: ['zoomControl']
        });

        $balloons.each(function () {
            var longitude = +$(this).attr('data-longitude'),
                latitude = +$(this).attr('data-latitude');

            var officePlacemark = new ymaps.Placemark([longitude, latitude], {});
            map.geoObjects.add(officePlacemark);
        });

        map.setBounds(map.geoObjects.getBounds(), {
            checkZoomRange: true
        });
    }
}
$(function () {
    if ($('#contacts_form').length) {


        initFeedbackForm();
        initMask();

        $('select').styler({
            selectSmartPositioning: false,
            selectSearch: false,
            onSelectOpened: function () {
                $(this).find('.jq-selectbox__dropdown ul').jScrollPane();
            }
        });

        $('.input-file').styler({
            filePlaceholder: 'Прикрепить файл'
        });
    }
});


function initFeedbackForm() {

    var $form = $('#contact_form'),
        $feedbackType = $form.find('#feedback_type'),
        $feedbackQuestionType = $('#feedback_question_type'),
        $feedbackThemeField = $form.find('#feedback_theme_field'),
        $feedbackFileList = $form.find('#feedback_file_list'),
        $supportSuccess = $('#contacts_success'),
        $remarkText = $('.mig-text-ico');

    $feedbackType.on('change', function () {
        if ($(this).val() === '5') {
            $feedbackThemeField.removeClass('hide');

        } else {
            $feedbackThemeField.addClass('hide');
            $feedbackThemeField.find('.field').removeClass('error');

        }
    });

    $('[data-type="close-message"]').on('click', function () {
        // clearForm($form);
        $form.removeClass('hide');
        $supportSuccess.addClass('hide');
        $remarkText.removeClass('hide');
        return false;
    });

    // добавление файлов
    var fileCount = 1,
        fileCountMax = 3;

    $form.on('change', '.feedback-file', function () {
        if (!$(this).val()) return false;

        if (fileCount >= fileCountMax) return false;

        var fileHTML = '<div class="col w-50"><div class="field for-file"><input type="file" name="feedback_file[]" class="input-file feedback-file" accept=".txt,.rftm,.doc,.docx,.jpg,.png"></div></div>';
        if (fileCount === 2) fileHTML += '<div class="clr"></div>';

        $feedbackFileList.append(fileHTML);
        $feedbackFileList.find('.feedback-file').last().styler({
            filePlaceholder: 'Прикрепить файл'
        });

        fileCount++;
    });

    $('#contact_form').on('change', '.feedback_file', function () {
        if ($(this).val() != '') {
            // проверка на кол-во
            if ($('input.feedback_file').length < 3) {
                var br = $('<br>');
                var file = $('<input type="file" name="feedback_file[]" id="feedback_file" class="feedback_file">');
                $('#contacts_form .form-wrapper .fields-wrapper .field.file').append(br).append(file);
                file.styler({
                    filePlaceholder: 'Прикрепить файл'
                });
            };
        };
    });

    // отслеживаем изменения в валидируемых полях
    $form.on('change', 'input, select, textarea', function () {
        validateField($(this));
    });


    // отправка формы
    $form.on('submit', function () {

        if (validateForm($form)) {

            var form = document.forms.contacts_form;
            var formData = new FormData(form);

            var xhr = new XMLHttpRequest();
            xhr.open('POST', '/contacts/ajax.php');

            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        data = xhr.responseText;
                    }
                }
            };

            xhr.send(formData);

            $form.addClass('hide');
            $supportSuccess.removeClass('hide');
            $remarkText.addClass('hide');
        }
        return false;
    });
}

$(document).ready(function () {
    $('.faq a').on('click', function () {
        var $faq = $(this).parent().parent();
        if ($faq.hasClass('active')) {
            $faq.removeClass('active');
        } else {
            $faq.addClass('active').siblings('.active').removeClass('active');
        }
        return false;
    });


    $('#vacancies_list .vacancy-title a').on('click', function () {
        var $vacancy = $(this).parent().parent();
        if ($vacancy.hasClass('active')) {
            $vacancy.removeClass('active');
        } else {
            $vacancy.addClass('active').siblings('.active').removeClass('active');
        }
        return false;
    });

    $('#vacancies_city').on('change', function () {
        var city = $(this).val();
        $('#body').addClass('noscroll');
        if (city == 'all') {
            $('#vacancies_list .vacancy').removeClass('hide-visibility active');
        } else {
            $('#vacancies_list .vacancy').addClass('hide-visibility').removeClass('active');
            $('#vacancies_list .vacancy[data-city=' + city + ']').removeClass('hide-visibility');
        }
        setTimeout(function () {
            $('#body').removeClass('noscroll');
        }, 500);
    });
    // Вакансии




});

/*  ==================
	ОФИСЫ
	================== */
if ($('#office_list_yandex').length) {

    function initOfficeListYandex() {
        var map, objectManager;

        var $switches = $('#office_view a'),
            $list = $('#office_list_yandex'),
            $map = $('#office_map_yandex'),
            $officeFilter = $('#office_filter_yandex'),
            $officeRegion = $('#office_region'),
            $officeCityField = $('#office_city_field'),
            $officeCity = $('#office_city');

        $officeRegion.on('change', function () {
            var region = $(this).val();

            if (!region) {
                $officeCityField.addClass('hide');
                $officeCity.val('');

            } else {
                //формируем массив городов для региона
                var classTR = 'r' + region;
                var cityArray = {};
                var cityList = '';

                $('#office_list_yandex table tr.' + classTR).each(function () {
                    if (!$(this).hasClass('reg')) {

                        cityArray[$(this).data('cityname')] = $(this).data('city');
                    }

                });

                var cityArrayLength = 0;
                for (var key in cityArray) {
                    cityList += '<option value="' + cityArray[key] + '">' + key + '</option>';
                    cityArrayLength++;
                }

                if (cityArrayLength > 1) {
                    cityList = '<option value="">Все города</option>' + cityList;
                }

                $officeCity.html(cityList).trigger('refresh');

                $officeCityField.removeClass('hide');
            }
            applyFilter();
        });

        $officeCity.on('change', function () {
            applyFilter();
        });

        ymaps.ready(function () {
            initMap();
        });


        $switches.on('click', function () {
            if ($(this).hasClass('active')) return false;

            $(this).addClass('active').siblings().removeClass('active');

            var type = $(this).attr('href');
            if (type === '#map') {
                $list.addClass('hide');
                $map.removeClass('hide');

            } else {
                $map.addClass('hide');
                $list.removeClass('hide');
            }

            applyFilter();

            return false;
        });


        // инициализация яндекс-карты
        function initMap() {
            map = new ymaps.Map('offices_map', {
                center: [53.195428, 50.101821],
                zoom: 5,
                controls: ['geolocationControl', 'zoomControl']
            }, {
                suppressMapOpenBlock: true
            });


            objectManager = new ymaps.ObjectManager({
                clusterize: true,
                gridSize: 100,
                clusterOpenBalloonOnClick: true,
                clusterDisableClickZoom: false
            });

            addObjectsOnMap();
        }

        //формируем JSON балунов для ObjectManager
        function addObjectsOnMap() {
            var features = [];
            $('#office_list_yandex tr:not(:first-child,.reg)').each(function () {
                var $this = $(this),
                    id = $this.attr('data-id'),
                    coords = $(this).attr('data-coords'),
                    city = $this.attr('data-city'),
                    region = $(this).attr('class').replace('c' + city + ' r', '');

                if (!coords) return false;

                coords = coords.split(',');

                // HTML информации об офисе
                var officeHTML = '';
                officeHTML += '<div class="city">' + $this.find('.col1 p').html() + '</div>';
                officeHTML += '<div class="address">' + $this.find('.b-adr').html() + '</div>';
                officeHTML += '<div class="phone">' + $this.find('.b-phone').html() + '</div>';

                // html с графиком работы
                var workTimeHTML = '';
                $this.find('.w-time').each(function () {
                    workTimeHTML += '<tr><td><div class="weekday">' + $(this).find('.day').html() + '</div></td><td><div class="time">' + $(this).find('.time').html() + '</div></td></tr>';
                });

                if (workTimeHTML) workTimeHTML = '<table>' + workTimeHTML + '</table>';

                // итоговая HTML с контентом балуна
                var balloonContent = '<div class="yamap-balloon-info">' + officeHTML + workTimeHTML + '</div>';

                features.push({
                    type: 'Feature',
                    id: id,
                    geometry: {
                        type: 'Point',
                        coordinates: [$.trim(coords[0]), $.trim(coords[1])],
                    },
                    properties: {
                        balloonContent: balloonContent,
                        id: id,
                        city: city,
                        region: region
                    },
                    options: {
                        preset: 'islands#greenIcon',
                        // preset: 'islands#darkGreenIcon',
                        hideIconOnBalloonOpen: false
                    }
                });
            });

            objectManager.add({
                type: 'FeatureCollection',
                features: features
            });

            map.geoObjects.add(objectManager);

            objectManager.clusters.options.set({
                preset: 'islands#greenClusterIcons'
                // preset: 'islands#darkGreenClusterIcons'
            });
        }

        function mapRefreshBounds() {
            map.container.fitToViewport();

            var bounds = objectManager.getBounds();
            if (bounds[0][0] === bounds[1][0] && bounds[0][1] === bounds[1][1]) {
                setTimeout(function () {
                    map.setZoom(13);
                }, 200);
                map.setCenter(bounds[0]);

            } else {
                map.setBounds(objectManager.getBounds());
            }
        }

        // позиционирование фильтров 

        // применение фильтров офисов
        function applyFilter() {
            // получаем значение офиса
            var region = $officeRegion.val(),
                city = $officeCity.val();

            // фильтры для карты	
            var filterQueryStr = '';
            // класс для таблицы
            var trClass = '';

            if (region && region !== 'all') {
                filterQueryStr += 'properties.region == ' + region;
                trClass += '.r' + region;
            }
            if (city && city !== 'all') {
                filterQueryStr += '&properties.city == ' + city;
                trClass += '.c' + city;
            }

            //применяем фильтры для карты
            if (!filterQueryStr) 'properties.id > 0'

            objectManager.setFilter(filterQueryStr);

            mapRefreshBounds();

            // применяем фильтры для таблицы
            $list.find('tr:not(:first-child)').removeClass('hide');
            if (trClass) {
                $list.find('tr:not(' + trClass + ',:first-child, .reg.r' + region + ')').addClass('hide');
            }

            // скролл к первой не disable строке!
            var top = $list.find('tr:not(.hide, :first-child)').first().offset().top;

            $('html').addClass('disable-scroll');
            $.scrollTo(top, 200, {
                axis: 'y',
                onAfter: function () {
                    setTimeout(function () {
                        $('#header_wrapper').removeClass('show');
                        $('html').removeClass('disable-scroll');
                    }, 50);
                }
            });
        }
    }
    initOfficeListYandex();
}

// var data = $(this).data('maphilight') || {};
//коля
if ($('#inner_regions_map').length) {
    $('.maphilight').maphilight({
        fillColor: '7dc041',
        fillOpacity: 0.3,
        stroke: false,
        alwaysOn: true,
        wrapClass: true
    });

    $('#map_rf').on('mouseenter', 'area', function (e) {
        $('.region-tooltip').text($(this).attr('data-region'))
        var data = $(this).data('maphilight') || {};
        data.alwaysOn = data.alwaysOn;
        data.fillOpacity = 1;
        $(this).data('maphilight', data).trigger('alwaysOn.maphilight');

        tooltipPosition()
    });
    $('#map_rf').on('mouseout', 'area', function (e) {  
        var data = $(this).data('maphilight') || {};
        data.alwaysOn = data.alwaysOn; 
        data.fillOpacity = 0.3;
        $(this).data('maphilight', data).trigger('alwaysOn.maphilight');

        handlerMouseleave()
    });

}

// обработчик наведения на объект
// обработчик потери фокуса объекта
function handlerMouseleave(item) {
    //скрываем тултип
    $('.region-tooltip').removeClass('show');
    document.onmousemove = null;
}
//коля

//функция позиционирования тултипа
function tooltipPosition(e) {

    document.onmousemove = function (e) {
        mousePos(e)
    };
    var mouseX = 0;
    var mouseY = 0;

    function mousePos(e) {
        mouseX = e.pageX;
        mouseY = e.pageY;

        mouseX = event.clientX + $(window).scrollLeft();
        mouseY = event.clientY + $(window).scrollTop();

        var top = mouseY - 35 + 'px',
            left = mouseX + 15 + 'px',
            tooltipHeight = $('.region-tooltip').height() + 30, //дополнительный отступ 30
            tooltipWidth = $('.region-tooltip').width() + 15; //дополнительный отступ 15
        //показ тултипа
        $('.region-tooltip').addClass('show');
        //условия, чтобы тултип не ушел за вьюпорт
        $('.region-tooltip').css({
            top: top,
            left: left
        });
        return true;
    }

}

// авторизация
function initAuthPage() {
    // основные HTML объекты
    var $authPage = $('#authpage'),
        $form = $authPage.find('.form'),
        $caption = $('#caption'),
        $fieldPhone = $('#field_phone'),
        $phone = $('#phone'),
        $fieldPassword = $('#field_password'),
        $password = $('#password'),
        $errorMessage = $('#error_message'),
        $buttonSubmit = $('#button_submit'),
        $links = $('#links'),
        $linkReg = $('#link_reg'),
        $linkUserName = $('#link_username'),
        $linkAccess = $('#link_access'),
        $restoreTimer = $('#restore_timer'),
        $restoreSeconds = $('#restore_seconds'),
        $reCaptcha = $('#field_recaptcha');

    // флаг блокировки восстановления доступа
    var blockedRestore = false;

    // таймер для повторной отправки восстановления доступа
    var timerRestore;

    // значения с именем и номером телефона из куки!
    var userName = $('#user_name').val(),
        userPhone = $('#user_phone').val();

    if (userName && userPhone) {
        setUserData();
    } else {
        clearUserData();
    }

    // fullscreen();
    initPlaceholders();

    hidePreloader();

    // маска ввода для номера телефона
    $phone
        .on('change', function () {
            if (!validateField($phone)) {
                $fieldPhone.addClass('error');

            } else {
                $fieldPhone.removeClass('error');
            }
        });

    $password.on('change', function () {
        if (!validateField($password)) {
            $fieldPassword.addClass('error');

        } else {
            $fieldPassword.removeClass('error');
        }
    });

    // отправка формы заявки
    $form.on('submit', function () {
        var error = 0;

        if (!validateForm($form)) {
            error++;
        }


        if ($('.g-recaptcha:visible').length) {
            var v = grecaptcha.getResponse();
            if (v.length == 0) {
                error++;
                $reCaptcha.addClass('error');
            } else {
                $reCaptcha.removeClass('error');
            }
        }

        if (error === 0) {
            loginSubmit();
        }



        return false;
    });

    // переход к полной форме авторизации без приветствия
    $linkUserName.on('click', function () {
        clearUserData();
        return false;
    });

    // отправка запроса  на восстановление доступа
    $linkAccess.on('click', function () {
        var error = 0;
        if (!validateField($phone)) {
            $fieldPhone.addClass('error');
            error++;

        } else {
            $fieldPhone.removeClass('error');
        }

        if (error === 0) {
            restore();
            $password.val('').trigger('blur');
        }

        return false;
    });

    $authPage.on('click', '.restore-send-button', function () {
        var error = 0;
        if (!validateField($phone)) {
            $fieldPhone.addClass('error');
            error++;

        } else {
            $fieldPhone.removeClass('error');
        }

        if (error === 0) {
            restore();
        }

        return false;
    });

    // запрос на восстановление доступа
    function restore() {
        showPreloader();

        var login = $phone.inputmask('unmaskedvalue');

        $.ajax({
            url: '/login/restore.php',
            type: 'POST',
            dataType: 'json',
            data: {
                'login': login
            },
            success: function (data) {
                if (data.status == 1) {
                    var loginHidden = '+7 (' + login.slice(0, 3) + ') ** *' + login.slice(-2);
                    $caption.html('МигКредит отправил временный пароль на номер телефона <nobr>' + loginHidden + '</nobr>').removeClass('hide');
                    $fieldPhone.addClass('hide');

                    $linkReg.removeClass('hide');
                    $linkAccess.addClass('hide');
                    $linkUserName.addClass('hide');
                    $links.removeClass('hide');

                    // запускаем таймер до повторной отправки
                    startRestoreTimer(300);

                    hidePreloader();

                } else {
                    var messageHTML = '';
                    if (data.Fault_ID == 'PAD0001') {
                        // Превышено допустимое кол-во попыток смены пароля
                        messageHTML = '<p class="title">Превышено допустимое кол-во попыток смены пароля.</p><p>Попробуйте выполнить запрос похже или обратитесь по телефону <nobr>8-800-707-2115</nobr>.</a></p>';

                        // блокируем ссылку восстановления доступа
                        if (!blockedRestore) {
                            blockedRestoreLink();
                        }

                    } else if (data.Fault_ID == 'PAD0002') {
                        // Сервис смены пароля недоступен
                        messageHTML = '<p class="title">Сервис смены пароля недоступен, мы работаем над устранением причины.</p><p>Скорректируйте данные для входа.</p>';

                    } else if (data.Fault_ID == 'PAD0003') {
                        // Нет действующей учетной записи
                        messageHTML = '<p class="title">Нет действующей учетной записи.</p><p>Для регистрации личного кабинета воспользуйтесь <a href="/lk_access/">ссылкой</a> или обратитесь по телефону <nobr>8-800-707-2115</nobr>.</p>';

                    } else if (data.Fault_ID == 'PAD0004') {
                        // максимум 3 раза в сутки восстановление доступа
                        messageHTML = '<p class="title">Превышено допустимое количество попыток смены пароля.</p><p>Введите пароль, полученный в СМС, или повторите попытку через 24 часа.</p>';

                        // блокируем ссылку восстановления доступа на сутки!
                        if (!blockedRestore) {
                            blockedRestoreLink(86400000);
                        }

                    } else if (data.Fault_ID == 'PAD0005') {
                        // запускаем таймер до повторной отправки
                        var seconds = +data.Fault_Description;
                        startRestoreTimer(seconds);

                    } else {
                        messageHTML = '<p class="title">Что-то пошло не так...</p><p>Попробуйте еще раз или обратитесь к нам через <a href="/feedback/">форму обратной связи</a>, описав ситуацию и приложив скриншот ошибки.</p>';
                    }

                    showError(messageHTML);
                    hidePreloader();
                }
            },
            error: function (data) {
                showError('<p class="title">Что то пошло не так...</p><p>Попробуйте еще раз или обратитесь к нам через <a href="/feedback/">форму обратной связи</a>, описав ситуацию и приложив скриншот ошибки.</p>');
                hidePreloader();
            },
            timeout: 130000
        });
    }

    // блокировка кнопки восстановления доступа
    function blockedRestoreLink() {
        blockedRestore = true;
        $linkAccess.addClass('hide');

        setTimeout(function () {
            blockedRestore = false;
            $linkAccess.removeClass('hide');
        }, 60000);
    }

    // запуск таймера повторной отправки восстановления доступа
    function startRestoreTimer(seconds) {
        stopRestoreTimer();

        refreshRestoreTimer(seconds);

        $linkAccess.addClass('hide');
        $restoreTimer.removeClass('hide');
    }

    // остановка таймера повторной отправки восстановления доступа
    function stopRestoreTimer() {
        if (timerRestore) clearTimeout(timerRestore);

        $restoreTimer.addClass('hide');
        // если восстановление доступа не заблокировано
        if (!blockedRestore) $linkAccess.removeClass('hide');
    }

    function refreshRestoreTimer(time) {
        //если время еще есть запускаем фукнцию заново
        //иначе даем возможность повторной отправки СМС кода и изменения номера
        if (time > 1) {
            time--;

            var seconds = time;
            var minutes = Math.floor(seconds / 60);
            seconds -= minutes * 60;

            //доп.проверки - если колво секунд/минут 60
            if (seconds == 60) {
                minutes--;
                seconds = 59;
            }

            if (minutes < 10) minutes = '0' + minutes;
            if (seconds < 10) seconds = '0' + seconds;

            $restoreTimer.html('Повторная отправка через ' + minutes + ':' + seconds);
            timerRestore = setTimeout(function () {
                refreshRestoreTimer(time);
            }, 1000);

        } else {
            stopRestoreTimer();
        }
    }

    // запрос на авторизацию
    function loginSubmit() {
        showPreloader();

        var login = $phone.inputmask('unmaskedvalue'),
            password = $.trim($password.val()),
            recaptcha = grecaptcha.getResponse();

        password = $.sha1(password);

        $.ajax({
            url: '/login/save.php',
            type: 'POST',
            dataType: 'json',
            data: {
                'login': login,
                'password': password,
                'gResponse': recaptcha
            },
            success: function (data) {
                if (data.status == 1) {
                    window.location.href = data.url;
                    resetCaptcha();

                } else {
                    var messageHTML = '';
                    if (data.Fault_ID == 'UCDB0102') {
                        // сообщение 108
                        messageHTML = '<p class="title">Нет действующей учетной записи.</p><p><a href="/lk_access/">Зарегистрироваться</a></p>';

                    } else if (data.Fault_ID == 'UCDB0103') {
                        if (+data.loginFault103Count >= 5) {
                            $reCaptcha.show();
                            messageHTML = '<p class="title">Защита от автоматического заполнения.<br>Подтвердите, что Вы не робот</p>';

                            if (+data.loginFault103Count > 5) {
                                resetCaptcha();
                                messageHTML = '<p class="title">Неверно введен пароль. <br>Подтвердите, что Вы не робот</p>';
                                $password.val('').trigger('blur');
                            }

                        } else {
                            // сообщение 109
                            messageHTML = '<p class="title">Неверно введен телефон/пароль.</p><p><a href="/lk_access/">Зарегистрироваться</a></p>';
                            if (!timerRestore) {
                                messageHTML += '<p><a href="#" class="restore-send-button">Восстановить доступ</a></p>';
                            }

                            resetCaptcha();
                        }

                    } else {
                        messageHTML = '<p class="title">Что-то пошло не так...</p><p>Попробуйте еще раз или обратитесь к нам через <a href="/feedback/">форму обратной связи</a>, описав ситуацию и приложив скриншот ошибки.</p>';
                    }

                    showError(messageHTML);
                    hidePreloader();
                }
            },
            error: function (data) {
                showError('<p class="title">Что-то пошло не так...</p><p>Попробуйте еще раз или обратитесь к нам через <a href="/feedback/">форму обратной связи</a>, описав ситуацию и приложив скриншот ошибки.</p>');
                hidePreloader();
            },
            timeout: 130000
        });
    }

    // сообщение об ошибке, на вход HTML ошибки
    function showError(message) {
        $errorMessage.html(message).removeClass('hide');
    }

    // скрытие ошибки
    function hideError() {
        $errorMessage.addClass('hide');
    }

    // добавление данных о пользователи в UI из куки
    function setUserData() {
        // добавляем номер телефона из куки и скрываем поле ввода
        $phone.val(userPhone);
        $fieldPhone.addClass('hide');

        // проверяем возможность восстановления доступа
        // если указано кол-во секунд до повторной отправки!
        var seconds = +$restoreSeconds.val();
        if (seconds > 0) {
            // формируем экран с сообщением о временном пароле
            var loginHidden = '+7 (' + userPhone.slice(0, 3) + ') ** *' + userPhone.slice(-2);
            $caption.html('МигКредит отправил временный пароль на номер телефона <nobr>' + loginHidden + '</nobr>').removeClass('hide');
            $fieldPhone.addClass('hide');

            $linkReg.removeClass('hide');
            $linkAccess.addClass('hide');
            $linkUserName.addClass('hide');
            $links.removeClass('hide');

            // запускаем таймер до повторной отправки
            startRestoreTimer(seconds);

        } else {
            // формируем заголовок
            $caption.html('Здравствуйте, ' + userName + '!').removeClass('hide');

            // показываем ссылку я не надежда и скрываем ссылку Зарегистрироваться
            $linkUserName.html('Я не ' + userName).removeClass('hide');
            $linkReg.addClass('hide');
            $links.removeClass('hide');
        }
    }
    // очистка данных о пользователе
    function clearUserData() {
        // очищаем номер телефона и показываем его
        $phone.val('');
        $fieldPhone.removeClass('hide');

        // очищаем заголовок и скываем его
        $caption.addClass('hide').html('');

        // скрываем ссылку я не надежда и показываем ссылка Зарегистрироваться
        $linkUserName.addClass('hide').html('');
        $linkReg.removeClass('hide');
        $links.removeClass('hide');
    }

    // фулскрин блоки
    // function fullscreen() {
    //     setHeight();

    //     $(window).on('resize scroll', function () {
    //         setHeight();
    //     });

    //     function setHeight() {
    //         var windowWidth = +$(window).width(),
    //             windowHeight = +$(window).height(),
    //             headerHeight = +$('.header').height(),
    //             breadcrumsHeight = 0;
    //         if ($('.breadcrumbs').length) breadcrumsHeight = +$('.breadcrumbs').outerHeight(true);

    //         var height = windowHeight - headerHeight - breadcrumsHeight;
    //         if (height < 470 || windowWidth < 1000) height = 470;

    //         $authPage.css('minHeight', height + 'px');

    //         // доп.классы в зависимости от высоты
    //         if (windowHeight < 800) {
    //             $('html').addClass('height-small');
    //         } else {
    //             $('html').removeClass('height-small');
    //         }
    //     }
    // }

    //placeholders
    function initPlaceholders() {
        $('.custom-placeholder').each(function () {
            if (!$(this).hasClass('ready')) {
                var $this = $(this);
                var $field = $this.parent();
                var plh = $this.data('placeholder');
                var val = $.trim($this.val());
                if ((val == '' || val == plh) && plh != '' && plh != undefined) {
                    $field.addClass('empty');
                } else {
                    $field.removeClass('empty');
                }

                $field.prepend('<span class="label">' + plh + '</span>');

                $(this).addClass('ready');

                $(this).on('focus', function () {
                    var $this = $(this);
                    var $field = $this.parent();
                    var plh = $this.data('placeholder');
                    var val = $.trim($this.val());
                    if (!$this.prop('readonly')) {
                        if (val == '' || val == plh) {
                            $field.removeClass('empty');
                            $this.val('');
                        }
                    }
                }).on('blur', function () {
                    var $this = $(this);
                    var $field = $this.parent();
                    var val = $.trim($this.val());
                    var plh = $this.data('placeholder');

                    if (val == '' || val == plh) {
                        $field.removeClass('error success').addClass('empty');
                    } else {
                        $field.removeClass('empty');
                    }
                });

            }

        })
    }
    // капча
    function resetCaptcha() {
        grecaptcha.reset()
    }
    // показать/скрыть прелоадер
    function showPreloader() {
        $authPage.addClass('load');
    }

    function hidePreloader() {
        $authPage.removeClass('load');
    }
}



