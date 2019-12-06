$(function () {
    console.log(0);
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

    if($('#macbook_slider').length){
        initSeoMacbookSlider();
    }

    if ($('.how-invest-mini-calc')) {
        initInvestors();
    }

    // читать полностью
    if ($('.show-more').length) {
        $('.show-more').on('click', function() {
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
    setTimeout(function() {
        $calculators.each(function() {
            init($(this));
        });
    },  1500);

    $.ajax({
        url: 'https://migcredit.ru/ajax/calc2.php',
        success: function (data) {
            calculatorData = data;
            $calculators.each(function() {
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
function initInfographicSliderInMain()  {
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
function initExpertsSliderInMain()  {
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
        $('[data-tabs-block]').each(function() {
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

    $tabs.on('click', '.switch', function() {
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
    $('.circles').on('click','.item', function () {
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

    setTimeout(function() {
        $calculators.each(function() {
            init($(this));
        });
    },  1500);


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
