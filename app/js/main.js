$(function () {
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

    $(window).on('resize', function () {
        resizeModal();
    });

    if ($('#main_slider').length) {
        initMainSlider();
    }

    // форма обратной связи
    initFeedbackForm();


    // основной калькулятор
    if ($('#calculator').length) {
        initCalculator();
    }

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


});


// обновление классов в зависимости от высоты viewport
function refreshHeightClass() {
    refresh();

    $(window).on('resize', function () {
        refresh();
    });

    function refresh() {
        var viewportHeight = $(window).height();

        var htmlClass = '';
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
        if ($(this).val() != '') {
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

function initCalculator() {
    // основные HTML элементы
    var $calculator = $('#calculator'),
        $calculatorPeriod = $calculator.find('#calculator_period'),
        $calculatorPeriodLabel = $calculator.find('#calculator_period_label'),
        $calculatorPeriodMin = $calculator.find('#calculator_period_min'),
        $calculatorPeriodMinLabel = $calculator.find('#calculator_period_min_label'),
        $calculatorPeriodMax = $calculator.find('#calculator_period_max'),
        $calculatorPeriodMaxLabel = $calculator.find('#calculator_period_max_label'),
        $calculatorPeriodAlert = $calculator.find('#calculator_period_alert'),
        $calculatorSum = $calculator.find('#calculator_sum'),
        $calculatorSumMin = $calculator.find('#calculator_sum_min'),
        $calculatorSumMax = $calculator.find('#calculator_sum_max'),
        $calculatorSumAlert = $calculator.find('#calculator_sum_alert'),
        $calculatorLabel1 = $calculator.find('#calculator_label1'),
        $calculatorValue1 = $calculator.find('#calculator_value1'),
        $calculatorLabel2 = $calculator.find('#calculator_label2'),
        $calculatorValue2 = $calculator.find('#calculator_value2'),
        $calculatorLabel3 = $calculator.find('#calculator_label3'),
        $calculatorValue3 = $calculator.find('#calculator_value3'),
        $calculatorPeriodType = $calculator.find('#calculator_period_type');

    // данные калькулятора для расчетов
    var calculatorData = calculatorTestData;

    init();
    $.ajax({
        url: 'https://test3.migcredit.ru/ajax/calc2.php',
        success: function (data) {
            calculatorData = data;
            init();
        }
    });

    function init() {
        var defaultSumMin = +calculatorData.setting.sum_min,
            defaultSumMax = +calculatorData.setting.sum_max,
            defaultSumCur = +calculatorData.setting.sum_cur;

        $calculatorSumMin.html(numberFormat(defaultSumMin));

        if (MIGONE) {
            $calculatorSumMax.html(numberFormat(defaultSumMax));

        } else {
            $calculatorSumMax.html(numberFormat((defaultSumMax + 2000)));
        }


        $calculatorSum.val(numberFormat(defaultSumCur));

        var periodSliderMax = calculatorData.item[defaultSumCur].data.length * 1 + 1,
            periodSliderValue = Math.round(periodSliderMax / 2);

        var period = periodSliderValue;

        var typeCalculator = calculatorData.item[defaultSumCur].data[period].term_type;

        //строка для сравнения - нужна для переинициализации ползунка периода
        var strSlider = '';

        $calculatorPeriodType.val(typeCalculator);

        var $sumSlider = $('#calculator_sum_slider').slider({
            range: 'min',
            value: defaultSumCur,
            min: defaultSumMin,
            max: defaultSumMax,
            step: 1000,
            slide: function (event, ui) {
                $calculatorSum.val(numberFormat(ui.value));
                calculate();
            }
        });

        var $periodSlider = $('#calculator_period_slider').slider({
            range: 'min',
            value: periodSliderValue,
            min: 0,
            max: periodSliderMax,
            step: 1,
            slide: function (event, ui) {
                period = ui.value;
                //подпись и значение для текущего периода
                var term = calculatorData.item[$sumSlider.slider('value')].data[ui.value].term,
                    termLabel = calculatorData.item[$sumSlider.slider('value')].data[ui.value].term_type_ru;

                $calculatorPeriodLabel.html(termLabel);
                $calculatorPeriod.val(term);

                typeCalculator = calculatorData.item[$sumSlider.slider('value')].data[ui.value].term_type;
                calculate();
            }
        });

        $calculatorPeriod.on('change', function () {
            var sum = +getClearVal($calculatorSum.val());

            if (!validateField($calculatorPeriod)) {
                $(this).val(calculatorData.item[sum].data[period].term);

            } else {
                var termCheck = 0;
                var newTerm = jQuery.trim($(this).val()) * 1;

                //ищем введенный срок для суммы
                for (var i = 0; i < calculatorData.item[sum].data.length * 1; i++) {
                    if (
                        newTerm === calculatorData.item[sum].data[i].term
                        && typeCalculator === calculatorData.item[sum].data[i].term_type
                    ) {
                        termCheck++;
                        $calculatorPeriodLabel.html(calculatorData.item[sum].data[i].term_type_ru);
                        $periodSlider.slider('value', i);
                        period = i;

                        calculate();
                    }
                }

                //если указанный срок не найден найден
                if (!termCheck) {
                    $(this).val(calculatorData.item[sum].data[period].term);
                }
            }
        });


        $calculatorSum.on('change', function () {
            //alert($(this).val());
            if (!validateField($calculatorSum)) {
                $(this).val($sumSlider.slider('value'));

            } else {
                var val = +getClearVal($(this).val());

                var ost = val % 1000;
                if (ost >= 500) {
                    val = Math.ceil(val / 1000) * 1000;

                } else if (ost < 500 && ost > 0) {
                    val = Math.floor(val / 1000) * 1000;
                }

                if (val > defaultSumMax) {
                    $(this).val(defaultSumMax);
                    val = defaultSumMax;

                } else if (val < defaultSumMin) {
                    $(this).val(defaultSumMin);
                    val = defaultSumMin;
                }


                $sumSlider.slider('value', val);
                $calculatorSum.val(numberFormat(val));
                calculate();

            }
        });

        calculate();

        $calculator.removeClass('load');

        function calculate() {
            var sum = getClearVal($calculatorSum.val());

            //в случае если изменяется период для суммы - переинициализация ползунков
            var strSliderNew = calculatorData.item[sum].str;
            if (strSliderNew != strSlider) {
                strSlider = strSliderNew;
                var sliderPeriodMin = 0,
                    sliderPeriodMax = calculatorData.item[sum].data.length * 1 - 1,
                    sliderPeriodValue = Math.round(sliderPeriodMax / 2) + 1;

                period = sliderPeriodValue;

                typeCalculator = calculatorData.item[sum].data[period].term_type;
                $calculatorPeriodType.val(typeCalculator);

                //подписи для min/max значения периода
                var termLabelMin = calculatorData.item[sum].data[0].term_type_ru,
                    termMin = calculatorData.item[sum].data[0].term;

                $calculatorPeriodMin.html(termMin);
                $calculatorPeriodMinLabel.html(termLabelMin);

                var termLabelMax = calculatorData.item[sum].data[sliderPeriodMax].term_type_ru,
                    termMax = calculatorData.item[sum].data[sliderPeriodMax].term;

                $calculatorPeriodMax.html(termMax);
                $calculatorPeriodMaxLabel.html(termLabelMax);

                //подпись и значение для текущего периода
                var term = calculatorData.item[sum].data[period].term,
                    termLabel = calculatorData.item[sum].data[period].term_type_ru;

                $calculatorPeriod.val(term);
                $calculatorPeriodLabel.html(termLabel);

                //переинициализация позунка периода
                //обновляем max/value
                $periodSlider.slider('option', {
                    min: 0,
                    max: sliderPeriodMax,
                    value: sliderPeriodValue
                });

            }


            //console.log(typeCalc);
            var labelReturn = 'Платеж раз в 2 недели';
            if (typeCalculator === 'day') {
                labelReturn = 'Возвращаете';
            }
            $calculatorLabel3.html(labelReturn);

            //подставляем данные по платежу
            $calculatorValue1.html($calculatorSum.val());

            //дата возврата
            var deadline = calculatorData.item[sum].data[period].deadline;
            $calculatorValue2.html(deadline);

            //сумма возврата/сумма со скидкой
            var payment = +calculatorData.item[sum].data[period].payment,
                discount = +calculatorData.item[sum].data[period].discount;

            console.log(discount);
            if (discount) {
                $calculatorValue3.html('<span class="new">' + numberFormat(discount) + '</span><span class="old">' + numberFormat(payment) + '</span> руб.');

            } else {
                $calculatorValue3.html('<span>' + numberFormat(payment, 0, '', ' ') + '</span> руб.');
            }

            //проверка показа сообщение
            //для суммы
            var noticeSum = +calculatorData.item[sum].data[period].notice_sum;
            if (!noticeSum) {
                $calculatorSumAlert.addClass('hide').html('');

            } else {
                $calculatorSumAlert.html(calculatorData.notice.sum[noticeSum]).removeClass('hide');
            }

            //для периода
            var noticeTerm = calculatorData.item[sum].data[period].notice_term;
            if (!noticeTerm) {
                $calculatorPeriodAlert.addClass('hide').html('');

            } else {
                $calculatorPeriodAlert.html(calculatorData.notice.term[noticeTerm]).removeClass('hide');
            }
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
    cases = [2, 0, 1, 1, 1, 2];
    return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
}

// показ/закрытие подтверждения выхода из ЛК
function openLogoutModal() {
    $('html').addClass('open-modal');
    $('#logout_modal').show();
    resizeModal();
}

function closeLogoutModal() {
    $('html').removeClass('open-modal');
    $('#logout_modal').hide();
}



// открытие|закрытие вкладок
function openTab(tab) {
    $('[data-tab]').removeClass('active');
    $('[data-tab="' + tab + '"]').addClass('active');
}
function closeTab(tab) {
    $('[data-tab="' + tab + '"]').removeClass('active');
}



function initMainSlider() {
    const slider = new Swiper('#main_slider', {
        preloadImages: false,
        lazy: true,
        autoplay: {
            delay: 5000,
        }
    });
}