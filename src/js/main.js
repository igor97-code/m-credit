$(function () {
    // обновление класса HTML в зависимости от высота вьюпорта
    refreshHeightClass();

    // переключение меню
    $('body').on('click', '.toggle-mobile-menu', function() {
        $('html').toggleClass('open-mobile-menu');
        return false;
    });

    initPlaceholders();

    initMask();

    $('select').styler({
        selectSmartPositioning: false,
        selectSearch: false,
        onSelectOpened: function() {
            // $(this).parents('.field').removeClass('error success empty');
            $(this).find('.jq-selectbox__dropdown ul').jScrollPane();
        }
    });

    $('.input-file').styler({
        filePlaceholder: 'Прикрепить файл'
    });

    $(window).on('resize', function() {
        resizeModal();
    });

    

    // форма обратной связи
    initFeedbackForm();


    // основной калькулятор
    if ($('#calculator').length) {
        initCalculator();
    }

    // вкладки
    $('body')
        .on('click', '.switches .switch', function() {
            var tab = $(this).attr('data-tab');
            if ($(this).hasClass('active')) {
                closeTab(tab);

            } else {
                openTab(tab);
            }
            return false;
        })
        .on('click', '.close-tab-button', function() {
            var tab = $(this).parents('.tab').attr('data-tab');
            closeTab(tab);
            return false;
        });

    // спойлер
    $('body').on('click', '.toggle-button', function() {
        $(this).parents('.toggle-block').toggleClass('open');
        return false;
    });


});


// обновление классов в зависимости от высоты viewport
function refreshHeightClass() {
    refresh();

    $(window).on('resize', function() {
        refresh();
    });

    function refresh() {
        var viewportHeight = $(window).height();
        
        var htmlClass = '';
        if (viewportHeight < 900) {
            $('html').addClass('height-medium');

        } else {
            $('html').removeClass('height-medium');
        }

        if (viewportHeight < 800) {
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

    $feedbackType.on('change', function() {
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

    $form.on('change', '.feedback-file', function() {
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
    $('#support_wrapper').on('change', '.feedback_file', function() {
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
    $form.on('change', 'input, select, textarea', function() {
        validateField($(this));
    });


    // отправка формы
    $form.on('submit', function() {
        if (validateForm($form)) {
            var formData = new FormData($supportForm);

            var xhr = new XMLHttpRequest();
            xhr.open("POST", "/mail/");

            xhr.onreadystatechange = function() {
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
        success: function(data) {
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
            slide: function(event, ui) {
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
            slide: function(event, ui) {
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

        $calculatorPeriod.on('change', function() {
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

        
        $calculatorSum.on('change', function() {
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
            if (!noticeSum ) {
                $calculatorSumAlert.addClass('hide').html('');

            } else {
                $calculatorSumAlert.html(calculatorData.notice.sum[noticeSum]).removeClass('hide');
            }

            //для периода
            var noticeTerm = calculatorData.item[sum].data[period].notice_term;
            if (!noticeTerm ) {
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

// пролонгация
function initProlongation() {
    var $prolongation = $('#prolongation'),
        $prolongationStep1 = $prolongation.find('#prolongation_step1'),
        $prolongationStep2 = $prolongation.find('#prolongation_step2');

    var countError = 0;
    
    $prolongationStep1.on('change', 'input[name="prlngTermValue"]', function() {
        refreshResult();
    });

    refreshResult();

    //показ формы пролонгации
    $('body').on('click', '.prolongation-show', function() {
        $('#loan_wrapper').hide();
        $prolongation.show();
        return false;
    });

    //отправка 1 шага
    $('#prolongation_submit').on('click', function() {
        sendAjax('createContract');
        return false;
    });

    //фукцния перехода по шагам
    function nextStep(step, status) {
        $prolongation.find('.step').addClass('hide');
        switch (step) {
            case 'step1':
                $prolongationStep1.removeClass('hide');

                break;

            case 'final':
                var finalMessage = '';
                if (status == '97') {
                    finalMessage = '<p class="align-center m-t-50 m-b-50">Произошла ошибка системы.</p>';
                }
                if (status == '99') {
                    finalMessage = '<p class="align-center m-t-50 m-b-50">Произошла ошибка системы.</p>';
                }

                $prolongationStep2.html(finalMessage).removeClass('hide');
                break;
        }

        $prolongation.removeClass('load');
    }
    //функция отправки данных
    function sendAjax(step) {
        $prolongation.addClass('load');

        if (countError > 5) {
            nextStep('final', '99');

        } else {
            switch (step) {
                case 'createContract':
                    var $input = $prolongationStep1.find('input[name="prlngTermValue"]:checked'),
                        prlngTermValue = $input.attr('data-termvalue'),
                        prlngTermTermUnit = $input.attr('data-termunit'),
                        prlngAmountAmount = $input.attr('data-amount'),
                        prlngAmountCurrencyCode = $input.attr('data-currency');

                    $.ajax({
                        url: '/ajax/prolongation.php',
                        type: 'POST',
                        data: {
                            'action': 'createContract',
                            'prlngTermValue': prlngTermValue,
                            'prlngTermTermUnit': prlngTermTermUnit,
                            'prlngAmountAmount': prlngAmountAmount,
                            'prlngAmountCurrencyCode': prlngAmountCurrencyCode
                        },
                        success: function(data) {
                            if (data.status == 1) {
                                countError = 0;
                                window.location.href = data.url;

                            } else if (data.status == 97) {
                                nextStep('final', '97');

                            } else {
                                errorAjax();
                            }
                        },
                        error: function(data) {
                            errorAjax();

                        },
                        timeout: 310000
                    });

                    break;
            }
        }

        function errorAjax() {
            countError++;
            setTimeout(function() { sendAjax(step); }, 7000);
        }
    }

    function refreshResult() {
        var $input = $prolongationStep1.find('input[name="prlngTermValue"]:checked');

        $('#prolongation_repayment').html($input.attr('data-repayment'));
        $('#prolongation_maturity').html($input.attr('data-maturity'));
    }
}

// форма изменения пароля
function initFormPasswordChange() {
    var $form = $('#form_password_change'),
        $formStep1 = $form.find('#form_password_change_step1'),
        $fieldPasswordOld = $form.find('#form_password_old'),
        $fieldPasswordNew = $form.find('#form_password_new'),
        $fieldPasswordNewRepeat = $form.find('#form_password_new_repeat'),
        $formStep1Submit = $form.find('#form_password_change_step1_submit'),
        $formStep1Error = $form.find('#form_password_change_step1_error'),
        $formStep2 = $form.find('#form_password_change_step2'),
        $fieldSmscode = $form.find('#form_password_smscode'),
        $timerSmscode = $form.find('#form_password_change_timer'),
        $formStep2Submit = $form.find('#form_password_change_step2_submit'),
        $formStep2Error = $form.find('#form_password_change_step2_error'),
        $formStepSuccess = $form.find('#form_password_change_step_success'),
        $formStepError = $form.find('#form_password_change_step_error');

    //номер СМСКИ для проверки!
    var smsId = 0;

    //проверка колва попыток ввода СМС
    var smsCheckCount = 0;
    
    $('body')
        .on('click', '.open-form-password-change', function() {
            if (!$(this).hasClass('disabled')) {
                // показ формы изменения пароля
                openForm();
            }

            return false;
        })
        .on('click', '.close-form-password-change', function() {
            // закрытие формы изменения пароля
            closeForm();

            return false;
        })
        .on('click', '.form-password-send-sms-button', function() {
            // отправить смс-код повторно
            if (!$(this).hasClass('disabled')) {
                sendAjax('getsms');
            }

            return false;
        })
        .on('click', '.form-password-goto-step-button', function() {
            // переход к шагам формы изменения пароля
            $fieldSmscode.val('').trigger('blur');

            var step  = $(this).attr('data-step');
            if (step === 'step1') {
                nextStep('step1');
            }

            if (step === 'step2') {
                nextStep('step2');
            }

            return false;
        });

    // отслеживаем изменения в валидируемых полях ввода
    $form.on('change', 'input.validate', function() {
        validateField($(this));
    });

    // отправка 1 шага формы
    $formStep1Submit.on('click', function() {
        var error = 0;
        
        if (validateForm($formStep1)) {
            // если форма заполнена валидно - проверяем пароли на совпадение
            var passwordNew = getClearVal($fieldPasswordNew.val()),
                passwordNewRepeat = getClearVal($fieldPasswordNewRepeat.val());
            
            if (passwordNew !== passwordNewRepeat) {
                $formStep1Error.html('Пароль был подтвержден не верно').parents('.col').removeClass('hide');
                $fieldPasswordNewRepeat.parents('.field').addClass('error');

            } else {
                $formStep1Error.html('').parents('.col').addClass('hide');
                $fieldPasswordNewRepeat.parents('.field').removeClass('error');
            }

        } else {
            error++;
        }

        if (error === 0) {
            sendAjax('getsms');
        }

        return false;
    });

    // проверка смс
    $formStep2Submit.on('click', function() {
        if (validateForm($formStep2)) {
            sendAjax('checksms');
        }

        return false;
    });

    function nextStep(step) {
        $form.find('.step').addClass('hide');
        $formStep1Error.parents('.col').addClass('hide');
        $formStep2Error.parents('.col').addClass('hide');
        
        switch (step) {
            case 'step1':
                $formStep1.removeClass('hide');
                break;

            case 'step2':
                $formStep2.removeClass('hide');
                break;

            case 'error':
                $formStepError.removeClass('hide');
                break;

            case 'success':
                $formStepSuccess.removeClass('hide');
                break;
        }

        $form.removeClass('load');
    }

    //функция отправки данных при изменении пароля
    function sendAjax(action) {
        $form.addClass('load');

        switch (action) {
            //отправка СМС!
            case 'getsms':
                $.ajax({
                    url: '/ajax/getsms.php',
                    type: 'POST',
                    data: {
                        'action': 'sendsms'
                    },
                    success: function(data) {
                        //если СМС успешно отправлена!
                        if (data.status == 1) {
                            smsId = data.sms_id;
                            smsCheckCount = 0;
                            timer(30);
                            nextStep('step2');

                        } else if (data.status == -1) {
                            //ошибка авторизации
                            alert('Время сессии истекло, авторизуйтесь заново!');
                            window.location.reload();

                        } else {
                            nextStep('step1');
                            $formStep1Error.html('Ошибка при отправке СМС!').parents('.col').removeClass('hide');
                        }
                    },
                    error: function() {
                        nextStep('step1');
                        $formStep1Error.html('Ошибка при отправке СМС!').parents('.col').removeClass('hide');
                    }
                });

                break;

            //проверка СМС
            case 'checksms':
                var smscode = getClearVal($fieldSmscode.val());

                $.ajax({
                    url: '/ajax/getsms.php',
                    type: 'POST',
                    data: {
                        'action': 'checksms',
                        'code': smscode,
                        'sms_id': smsId
                    },
                    success: function(data) {
                        smsCheckCount++;

                        //если верификация успешна
                        if (data.status == 1) {
                            sendAjax('ChangeAuthData');

                        } else if (data.status == -1) {
                            //ошибка авторизации
                            alert('Время сессии истекло, авторизуйтесь заново!');
                            window.location.reload();

                        } else {
                            var text = '';
                            if (smsCheckCount >= 5) {
                                text = 'К сожалению, исчерпан лимит попыток ввода смс-кода.';

                            } else {
                                text = 'Неверный смс код. <br><a href="#" class="form-password-goto-step-button color-main" data-step="step2">Попробуйте еще раз.</a>';
                            }

                            $formStepError.html('<p class="align-center m-t-50 m-b-50">' + text + '</p>');

                            nextStep('error');
                        }
                    },
                    error: function() {
                        var text = '';
                        if (smsCheckCount >= 5) {
                            text = 'К сожалению, исчерпан лимит попыток ввода смс-кода.';

                        } else {
                            text = 'Неверный смс код. <br><a href="#" class="form-password-goto-step-button color-main" data-step="step2">Попробуйте еще раз.</a>';
                        }

                        $formStepError.html('<p class="align-center m-t-50 m-b-50">' + text + '</p>');

                        nextStep('error');
                    }
                });

                break;

            case 'ChangeAuthData':
                var passwordOld = getClearVal($fieldPasswordOld.val());
                passwordOld = $.sha1(passwordOld);

                var passwordNew = jQuery.trim($fieldPasswordNew.val());
                passwordNew = $.sha1(passwordNew);

                //отправляем данные!
                $.ajax({
                    url: '/ajax/ChangeAuthData.php',
                    type: 'POST',
                    data: {
                        'action': 'ChangePassword',
                        'oldpassword': passwordOld,
                        'password': passwordNew
                    },
                    success: function(data) {
                        if (data.status == 1) {
                            nextStep('success');
                            setTimeout(function() {
                                closeForm();
                            }, 2000);

                        } else if (data.status == -1) {
                            //ошибка авторизации
                            alert('Время сессии истекло, авторизуйтесь заново!');
                            window.location.reload();

                        } else {
                            var text = 'Введен неверный текущий пароль. <br><a href="#" class="form-password-goto-step-button color-main" data-step="step1">Попробуйте еще раз.</a>';
                            $formStepError.html('<p class="align-center m-t-50 m-b-50">' + text + '</p>');
                            nextStep('error');
                        }
                    },
                    error: function() {
                        var text = 'Введен неверный текущий пароль. <br><a href="#" class="form-password-goto-step-button color-main" data-step="step1">Попробуйте еще раз.</a>';
                        $formStepError.html('<p class="align-center m-t-50 m-b-50">' + text + '</p>');
                        nextStep('error');
                    }
                });

                break;
        }
    }

    //таймер отправки смс
    var timerId;
    function timer(time) {
        if (time > 0) {
            $('.form-password-send-sms-button').addClass('disabled');
            $timerSmscode.html(time).removeClass('hide');
            time--;
            timerId = setTimeout(function() { timer(time); }, 1000);
 
        } else {
            if (timerId) clearTimeout(timerId);
            $('.form-password-send-sms-button').removeClass('disabled');
            $timerSmscode.addClass('hide').html('');
        }
    }
 
    // показ формы изменения пароля
    function openForm() {
        $('.open-form-password-change').addClass('hide');
        $('.open-form-mobile-phone-change').addClass('no-editable');
        $form.removeClass('hide');
    }

    // закрытие формы изменения пароля
    function closeForm() {
        $('.open-form-password-change').removeClass('hide');
        $('.open-form-mobile-phone-change').removeClass('no-editable');
        $form.addClass('hide');

        // возвращаем первый экран изменения пароля!
        nextStep('step1');
        if (timerId) clearTimeout(timerId);
    }
} 

// форма изменения пароля
function initFormMobilePhoneChange() {
    var $form = $('#form_mobile_phone_change'),
        $formStep1 = $form.find('#form_mobile_phone_change_step1'),
        $fieldPhoneNew = $form.find('#form_mobile_phone_field_new'),
        $fieldPassword = $form.find('#form_mobile_phone_password'),
        $formStep1Submit = $form.find('#form_mobile_phone_change_step1_submit'),
        $formStep1Error = $form.find('#form_mobile_phone_change_step1_error'),
        $formStep2 = $form.find('#form_mobile_phone_change_step2'),
        $fieldSmscode = $form.find('#form_mobile_phone_smscode'),
        $timerSmscode = $form.find('#form_mobile_phone_change_timer'),
        $formStep2Submit = $form.find('#form_mobile_phone_change_step2_submit'),
        $formStep2Error = $form.find('#form_mobile_phone_change_step2_error'),
        $formStepSuccess = $form.find('#form_mobile_phone_change_step_success'),
        $formStepError = $form.find('#form_mobile_phone_change_step_error');

    //номер СМСКИ для проверки!
    var smsId = 0;

    //проверка колва попыток ввода СМС
    var smsCheckCount = 0;
    
    $('body')
        .on('click', '.open-form-mobile-phone-change', function() {
            // показ формы изменения пароля
            if (!$(this).hasClass('no-editable')) {
                openForm();
            }

            return false;
        })
        .on('click', '.close-form-mobile-phone-change', function() {
            // закрытие формы изменения пароля
            closeForm();

            return false;
        })
        .on('click', '.form-mobile-phone-send-sms-button', function() {
            // отправить смс-код повторно
            if (!$(this).hasClass('disabled')) {
                sendAjax('getsms');
            }

            return false;
        })
        .on('click', '.form-mobile-phone-goto-step-button', function() {
            // переход к шагам формы изменения пароля
            $fieldSmscode.val('').trigger('blur');

            var step  = $(this).attr('data-step');
            if (step === 'step1') {
                nextStep('step1');
            }

            if (step === 'step2') {
                nextStep('step2');
            }

            return false;
        });

    // отслеживаем изменения в валидируемых полях ввода
    $form.on('change', 'input.validate', function() {
        validateField($(this));
    });

    // отправка 1 шага формы
    $formStep1Submit.on('click', function() {
        var error = 0;
        
        if (validateForm($formStep1)) {
            sendAjax('getsms');

        } else {
            error++;
        }

        if (error === 0) {
            
        }

        return false;
    });

    // проверка смс
    $formStep2Submit.on('click', function() {
        if (validateForm($formStep2)) {
            sendAjax('checksms');
        }

        return false;
    });

    function nextStep(step) {
        $form.find('.step').addClass('hide');
        $formStep1Error.parents('.col').addClass('hide');
        $formStep2Error.parents('.col').addClass('hide');
        
        switch (step) {
            case 'step1':
                $formStep1.removeClass('hide');
                break;

            case 'step2':
                $formStep2.removeClass('hide');
                break;

            case 'error':
                $formStepError.removeClass('hide');
                break;

            case 'success':
                $formStepSuccess.removeClass('hide');
                break;
        }

        $form.removeClass('load');
    }

    //функция отправки данных при изменении пароля
    function sendAjax(action) {
        $form.addClass('load');

        switch (action) {
            //отправка СМС!
            case 'getsms':
                $.ajax({
                    url: '/ajax/getsms.php',
                    type: 'POST',
                    data: {
                        'action': 'sendsms'
                    },
                    success: function(data) {
                        //если СМС успешно отправлена!
                        if (data.status == 1) {
                            smsId = data.sms_id;
                            smsCheckCount = 0;
                            timer(30);
                            nextStep('step2');

                        } else if (data.status == -1) {
                            //ошибка авторизации
                            alert('Время сессии истекло, авторизуйтесь заново!');
                            window.location.reload();

                        } else {
                            nextStep('step1');
                            $formStep1Error.html('Ошибка при отправке СМС!').parents('.col').removeClass('hide');
                        }
                    },
                    error: function() {
                        nextStep('step1');
                        $formStep1Error.html('Ошибка при отправке СМС!').parents('.col').removeClass('hide');
                    }
                });

                break;

            //проверка СМС
            case 'checksms':
                var smscode = getClearVal($fieldSmscode.val());

                $.ajax({
                    url: '/ajax/getsms.php',
                    type: 'POST',
                    data: {
                        'action': 'checksms',
                        'code': smscode,
                        'sms_id': smsId
                    },
                    success: function(data) {
                        smsCheckCount++;

                        //если верификация успешна
                        if (data.status == 1) {
                            sendAjax('ChangeAuthData');

                        } else if (data.status == -1) {
                            //ошибка авторизации
                            alert('Время сессии истекло, авторизуйтесь заново!');
                            window.location.reload();

                        } else {
                            var text = '';
                            if (smsCheckCount >= 5) {
                                text = 'К сожалению, исчерпан лимит попыток ввода смс-кода.';

                            } else {
                                text = 'Неверный смс код. <br><a href="#" class="form-mobile-phone-goto-step-button color-main" data-step="step2">Попробуйте еще раз.</a>';
                            }

                            $formStepError.html('<p class="align-center m-t-50 m-b-50">' + text + '</p>');

                            nextStep('error');
                        }
                    },
                    error: function() {
                        var text = '';
                        if (smsCheckCount >= 5) {
                            text = 'К сожалению, исчерпан лимит попыток ввода смс-кода.';

                        } else {
                            text = 'Неверный смс код. <br><a href="#" class="form-mobile-phone-goto-step-button color-main" data-step="step2">Попробуйте еще раз.</a>';
                        }

                        $formStepError.html('<p class="align-center m-t-50 m-b-50">' + text + '</p>');

                        nextStep('error');
                    }
                });

                break;

            case 'ChangeAuthData':
                var phone = getClearVal($fieldPhoneNew.val()),
                    password = getClearVal($fieldPassword.val());

                password = $.sha1(password);

                //отправляем данные!
                $.ajax({
                    url: '/ajax/ChangeAuthData.php',
                    type: 'POST',
                    data: {
                        'action': 'ChangePhone',
                        'newphone': phone,
                        'password': password
                    },
                    success: function(data) {
                        if (data.status == 1) {
                            nextStep('success');

                            setTimeout(function() {
                                closeForm();

                                // обновляем номер телефона в HTML
                                $('.mobile-phone-current').html('+7 ' + phone);
                            }, 2000);

                        } else if (data.status == -1) {
                            //ошибка авторизации
                            alert('Время сессии истекло, авторизуйтесь заново!');
                            window.location.reload();

                        } else {
                            var text = 'Введен неверный текущий пароль. <br><a href="#" class="form-mobile-phone-goto-step-button color-main" data-step="step1">Попробуйте еще раз.</a>';
                            $formStepError.html('<p class="align-center m-t-50 m-b-50">' + text + '</p>');
                            nextStep('error');
                        }
                    },
                    error: function() {
                        var text = 'Введен неверный текущий пароль. <br><a href="#" class="form-mobile-phone-goto-step-button color-main" data-step="step1">Попробуйте еще раз.</a>';
                        $formStepError.html('<p class="align-center m-t-50 m-b-50">' + text + '</p>');
                        nextStep('error');
                    }
                });

                break;
        }
    }

    //таймер отправки смс
    var timerId;
    function timer(time) {
        if (time === 30) time = 3;
        if (time > 0) {
            $('.form-mobile-phone-send-sms-button').addClass('disabled');
            $timerSmscode.html(time).removeClass('hide');
            time--;
            timerId = setTimeout(function() { timer(time); }, 1000);
 
        } else {
            if (timerId) clearTimeout(timerId);
            $('.form-mobile-phone-send-sms-button').removeClass('disabled');
            $timerSmscode.addClass('hide').html('');
        }
    }
 
    // показ формы изменения пароля
    function openForm() {
        $('.open-form-password-change').addClass('disabled');
        $('.open-form-mobile-phone-change').addClass('hide');
        $form.removeClass('hide');
    }

    // закрытие формы изменения пароля
    function closeForm() {
        $('.open-form-password-change').removeClass('disabled');
        $('.open-form-mobile-phone-change').removeClass('hide');
        $form.addClass('hide');

        // возвращаем первый экран изменения пароля!
        nextStep('step1');
        if (timerId) clearTimeout(timerId);
    }
}

// досрочное погашение
function initPrepayment() {
    //основные блоки HTML
    var $prepayment = $('#prepayment'), //обертка процесса досрочного погашения
        $prepaymentStep1 = $('#prepayment_step1'), //1й шаг формы - описание вариантов досрочного погашения
        $submitApplication = $('#submit_application'), //кнопка Оформить заявление
        $prepaymentType = $('#prepayment_type'), //варианты досрочного погашения
        $prepaymentTypeValue = $('#prepayment_type_value'), //скрытый инпат со значением выбранного типа погашения
        $prepaymentFIO = $('#prepayment_fio'), //скрытый инпат со значением фио пользователя
        $prepaymentDocId = $('#prepayment_DocId'), //скрытый инпат со значением ID документа
        $prepaymentStep2 = $('#prepayment_step2'), //2й шаг формы - характеристики выбранного варианта погашения
        $prepaymentDateItem = $('#prepayment_date_item'), //строка с выбором даты досрочного погашения
        $prepaymentDate = $('#prepayment_date'), //поле выбора даты
        $prepaymentSumItem = $('#prepayment_sum_item'), //строка с вводом суммы
        $prepaymentSum = $('#prepayment_sum'), //поле ввода суммы
        $submitStep2 = $('#submit_step2'), //кнопка отправки 2го шага формы
        $prepaymentStep3 = $('#prepayment_step3'), //3й шаг формы - условия досрочного погашения
        $submitStep3 = $('#submit_step3'), //кнопка отправки 3го шага формы
        $prepaymentStep4 = $('#prepayment_step4'), //4й шаг формы - смс подтверждение условий досрочного погашения
        $submitStep4 = $('#submit_step4'), //кнопка отправки 4го шага формы
        $smscode = $('#smscode'), //поле для ввода смс кода
        $timerSms = $('#timer_sms'), //блок с выводом времени до отправки повторной смс
        $repeatSms = $('#repeat_sms'), //кнопка отправки повторной смс
        $prepaymentStepFinal = $('#prepayment_step_final'); //финальный экран процесса!

    //флаг возможности повторной отправки смс:1 - возможна, 0 - нет
    var smsCount = '1';

    //при загрузке страницы
    //проверяем дозаполнение
    //если есть выбранный тип погашения
    //получаем ID документа и на экран подписи заявления
    var prepaymentType = $prepaymentTypeValue.val();
    if (prepaymentType != '') {
        var docId = $prepaymentDocId.val();
        //формируем текста страниц
        prepaymentCreateHTML(prepaymentType);

        //формируем ссылку на документ
        $('#prepayment_term_link_doc').attr('href', '/prepayment/doc.php?docid=' + docId);

        //на экран подписи заявления
        nextStep('step3');

    } else {
        $prepayment.removeClass('load');
    }

    //ШАГ 1
    //переключатели с описанием досрочных погашений
    $prepayment.on('click', '.toggle-button', function () {
        var $obj = $(this).parent();
        if ($obj.hasClass('open')) {
            $obj.removeClass('open');

        } else {
            $obj.addClass('open');
        }

        return false;
    });

    //оформить заявление - получения доступных вариантов погашения займа
    $submitApplication.on('click', function () {
        sendAjax('Check');
        return false;
    });

    //выбор варианта досрочного погашения
    $prepaymentType.on('click', '.button', function () {
        if (!$(this).hasClass('disable')) {
            var type = $(this).attr('data-type');

            //добавляем значение в скрытый инпат и формируем текста страниц
            $prepaymentTypeValue.val(type);
            prepaymentCreateHTML(type);

            //переход на следующий шаг
            nextStep('step2');
        }

        return false;
    });
    //END ШАГ 1


    //ШАГ 2
    //datepicker
    $prepaymentDate.datepicker({
        'minDate': 0,
        'maxDate': $prepaymentDate.attr('data-max'),
        // 'maxDate': '25.07.2018',
        'prevText': '',
        'nextText': '',
        onSelect: function (dateText, inst) {
            $(this).parents('.field').removeClass('empty error success');
        }
    });

    $prepayment.on('change', '.validate', function() {
        validateField($(this));
    });

    //отправка данных со 2 шага
    $submitStep2.on('click', function () {
        if (validateForm($prepaymentStep2)) {
            //формируем данные для отправки
            var data = {
                'action': 'CalcDP',
                'EarlyRepaymentType': $prepaymentTypeValue.val(),
                'EarlyRepaymentDate': $.trim($prepaymentDate.val()),
                'EarlyRepaymentAmount': $.trim($prepaymentSum.val())
            };

            sendAjax('CalcDP', data);
        }
   
        return false;
    });

    $('.reject-goto-final-message').on('click', function () {
        nextStep('final', 'reject_message');
        
        return false; 
    });
    //END ШАГ 2


    //ШАГ 3
    //отправка данных 3 шага
    $submitStep3.on('click', function () {
        sendAjax('sendSMS');
        return false;
    });
    //END ШАГ 3


    //ШАГ 4

    //отправка данных 4 шага
    $submitStep4.on('click', function () {
        if (validateForm($prepaymentStep4)) {
            var sms = $.trim($smscode.val());

            var data = {
                'action': 'Approve',
                'sms': sms
            };

            sendAjax('Approve', data);
        }

        return false;
    });

    //повторная отправка смс кода
    $repeatSms.on('click', function () {
        sendAjax('sendSMS');
        return false;
    });
    $prepayment.on('click', '.repeat-sms-code', function () {
        sendAjax('sendSMS');
        return false;
    });

    $('#back_to_step3_button').on('click', function () {
        nextStep('step3');
        return false;
    });
    //END ШАГ 4

    //отказ от досрочного погашения
    $prepayment.on('click', '.reject-prepayment', function () {
        sendAjax('Reject');
        return false;
    });

    //инициализация placeholderов
    // initPlaceholders();

    //переключатели в истории операций
    $prepayment.on('click', '.history-item .toggle', function () {
        var $obj = $(this).parent();
        if ($obj.hasClass('open')) {
            $obj.removeClass('open');

        } else {
            $obj.addClass('open');
        }

        return false;
    });

    //формирование HTML страниц в зависимости от выбранного типа погашения
    function prepaymentCreateHTML(type) {
        //варианты текстов
        var text1 = '',
            text2 = '',
            text3 = '';

        //по умолчанию скрываем поле ввода даты и суммы
        $prepaymentSumItem.hide();
        $prepaymentDateItem.hide();

        if (type == 'Full early repayment') {
            text1 = 'Полное досрочное погашение';
            text2 = 'Условия полного досрочного погашения (заявление)';
            text3 = 'полное досрочное погашение займа';

        } else if (type == 'Partial early repayment') {
            text1 = 'Частичное досрочное погашение';
            text2 = 'Условия частичного досрочного погашения (заявление)';
            text3 = 'частичное досрочное погашение займа';

            //для частичного погашения займа показываем поле ввода суммы
            $prepaymentSumItem.show();

        } else if (type == 'Repayment before the first payment') {
            text1 = 'Погашение до первого платежа';
            text2 = 'Условия погашения до первого платежа (заявление)';
            text3 = 'погашение займа до первого платежа';

            //для погашения до первого платежа - показываем поле выбора даты
            $prepaymentDateItem.show();
        }

        $prepayment.find('.prepayment-text-1').html(text1);
        $prepayment.find('.prepayment-text-2').html(text2);
        $prepayment.find('.prepayment-text-3').html(text3);
    }

    //отправка запросов
    //на вход шаг и данные для отправки
    function sendAjax(step, data) {
        if (data == undefined) {
            data = {};
        }

        if (step == 'Check') {
            $prepaymentType.addClass('load').show();
            $submitApplication.hide();

        } else {
            $prepayment.addClass('load');
        }


        switch (step) {
            case 'Check':
                $.ajax({
                    url: '/prepayment/lib/core/save.php',
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        'action': 'Check'
                    },
                    success: function (data) {
                        var status = data.status;
                        
                        smsCount = data.sms_count;

                        if (status == '1') {
                            //если лимит СМС не исчерпан - идем дальше
                            if (smsCount == '1') {
                                nextStep('step1_1');

                            } else {
                                nextStep('final', 'sms_limit');
                            }

                        } else {
                            //проверяем доступность погашения до первого платежа
                            //если недоступно - показ фин.окна
                            //иначе все кнопки disable кроме погашения до первого платежа
                            if ($prepaymentType.find('.button[data-type="Repayment before the first payment"]').hasClass('disable')) {
                                var Fault_Description = data.Fault_Description;
                                nextStep('final', status, Fault_Description);

                            } else {
                                $prepaymentType.find('.button[data-type="Full early repayment"], .button[data-type="Partial early repayment"]').addClass('disable');
                                nextStep('step1_1');
                            }
                        }
                    },
                    error: function (data) {
                        nextStep('final', '0');
                    },
                    timeout: 310000
                });
                break;

                //расчет досрочного погашения
            case 'CalcDP':
                $.ajax({
                    url: '/prepayment/lib/core/save.php',
                    type: 'POST',
                    dataType: 'json',
                    data: data,
                    success: function (data) {
                        var status = data.status;

                        if (status == '1') {
                            //формируем HTML текста с датой и суммой
                            var date = data.EarlyRepaymentDate,
                                sum = data.EarlyRepaymentAmount;

                            $prepaymentDate.val(date);

                            //для погашения до 1 платежа формируем сразу финальное окно!
                            if ($prepaymentTypeValue.val() == 'Repayment before the first payment') {
                                var text =  '<p class="color-main">Дата досрочного погашения ' + date + '</p>';
                                    text += '<p class="color-main">Сумма для ДП на выбранную дату ' + sum + ' руб.</p>';
                                    text += '<p>Обращаем Ваше внимание на то, что сумма актуальна только на указанную дату!</p>';

                                nextStep('final', 'success_first_payment', text);

                            } else {
                                //формируем ссылку на документ
                                $('#prepayment_term_link_doc').attr('href', '/prepayment/doc.php?docid=' + data.DocId);

                                nextStep('step3');
                            }

                        } else {
                            var Fault_Description = data.Fault_Description,
                                code = data.code;
                            nextStep('final', status, Fault_Description, code);
                        }
                    },
                    error: function (data) {
                        nextStep('final', '0');
                    },
                    timeout: 310000
                });
                break;

                //отказ от досрочного погашения
            case 'sendSMS':
                $.ajax({
                    url: '/prepayment/lib/core/save.php',
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        'action': 'sendSMS'
                    },
                    success: function (data) {
                        var status = data.status;
                        smsCount = data.sms_count;

                        if (status == '1') {
                            //проверяем возможность повторной отправки СМС
                            if (smsCount == '1') {
                                if (timerID != undefined) {
                                    clearTimeout(timerID);
                                }

                                timer(300);

                            } else {
                                $repeatSms.remove();
                                $timerSms.parent().remove();
                            }

                            nextStep('step4');

                        } else {
                            var Fault_Description = data.Fault_Description;
                            nextStep('final', status, Fault_Description);
                        }
                    },
                    error: function (data) {
                        nextStep('final', '0');
                    },
                    timeout: 310000
                });
                break;

                //подпись досрочного погашения
            case 'Approve':
                $.ajax({
                    url: '/prepayment/lib/core/save.php',
                    type: 'POST',
                    dataType: 'json',
                    data: data,
                    success: function (data) {
                        var status = data.status,
                            sms = data.sms; //флаг проверки смс

                        if (status == '1') {
                            //проверка корректности ввода смс-кода
                            if (sms == '1') {
                                nextStep('final', 'success');

                            } else {
                                //если смс введена не корректно
                                //проверяем возможность повторной отправки СМС
                                if (smsCount == '1') {
                                    //если есть попытки - показываем окно с кнопкой повторной отправки смс
                                    nextStep('final', 'sms_code');

                                } else {
                                    //лимит исчерпан
                                    nextStep('final', 'sms_limit');
                                }
                            }

                        } else {
                            var Fault_Description = data.Fault_Description;
                            nextStep('final', status, Fault_Description);
                        }
                    },
                    error: function (data) {
                        nextStep('final', '0');
                    },
                    timeout: 310000
                });
                break;

                //отказ от досрочного погашения
            case 'Reject':
                $.ajax({
                    url: '/prepayment/lib/core/save.php',
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        'action': 'Reject'
                    },
                    success: function (data) {
                        var status = data.status;
                        if (status == '1') {
                            nextStep('final', 'reject');

                        } else {
                            var Fault_Description = data.Fault_Description;
                            nextStep('final', status, Fault_Description);
                        }
                    },
                    error: function (data) {
                        nextStep('final', '0');
                    },
                    timeout: 310000
                });
                break;
        }
    }

    //переходы по шагам
    function nextStep(step, status, text, code) {
        //фио пользователя
        var fio = $prepaymentFIO.val();

        //скрываем все шаги
        $prepayment.find('.prepayment-step').hide();

        //показываем нужный шаг
        switch (step) {
            //первый шаг - описание вариантов досрочного погашения
            case 'step1':
                $prepaymentType.hide();
                $submitApplication.show();
                $prepaymentStep1.show();
                break;

                //1й шаг - выбор варианта досрочного погашения
            case 'step1_1':
                $prepaymentType.removeClass('load').show();
                $submitApplication.hide();
                $prepaymentStep1.show();
                break;

                //2й шаг - параметры досрочного погашения
            case 'step2':
                $prepaymentStep2.show();
                break;

                //3й шаг - условия досрочного погашения
            case 'step3':
                $prepaymentStep3.show();
                break;

                //4й шаг - смс подтверждение условий досрочного погашения
            case 'step4':
                $prepaymentStep4.show();
                break;

                //финальный экран
            case 'final':
                //формируем HTML финального экрана
                var finalMessageHTML = '';

                //HTML иконок
                var iconOkHTML = '<div class="icon without-border"><i class="icon-verified"></i></div>';
                var iconFalseHTML = '<div class="icon without-border"><i class="icon-lk-error"></i></div>';

                //успешное заполнение процесса
                if (status == 'success') {
                    finalMessageHTML += iconOkHTML;
                    finalMessageHTML += '<p class="big-text">Уважаемый(ая) ' + fio + ',</p><p>Вы успешно подписали заявление на досрочное погашение!</p>';
                    finalMessageHTML += '<p class="color-main">Дата досрочного погашения ' + $prepaymentDate.val() + '</p>';
                    finalMessageHTML += '<div class="sms-field m-t-40"><a href="/" class="button button-secondary">Продолжить</a></div>';
                                
                }

                //успешное погашение до 1 платежа
                if (status == 'success_first_payment') {
                    finalMessageHTML += iconOkHTML;
                    finalMessageHTML += '<p class="big-text">Уважаемый(ая) ' + fio + ',</p>';
                    finalMessageHTML += text;
                    finalMessageHTML += '<div class="sms-field m-t-40"><a href="/" class="button button-cancel">Закрыть</a></div>';
                }

                //Нарушение последовательности вызовов по процессу
                if (status == '95') {
                    finalMessageHTML += iconFalseHTML;
                    finalMessageHTML += '<p class="big-text">Уважаемый(ая) ' + fio + ', </p><p>произошла ошибка системы.</p>';
                    finalMessageHTML += '<div class="sms-field m-t-40"><a href="/" class="button button-cancel">Закрыть</a></div>';
                }

                //Закончился таймаут заполнения заявки
                if (status == '96') {
                    finalMessageHTML += iconFalseHTML;
                    finalMessageHTML += '<p class="big-text">Уважаемый(ая) ' + fio + ', </p><p>произошла ошибка системы.</p>';
                    finalMessageHTML += '<div class="sms-field m-t-40"><a href="/" class="button button-cancel">Закрыть</a></div>';
                }

                //Ошибка валидации данных с клиентской части
                if (status == '97') {
                    finalMessageHTML += iconFalseHTML;
                    finalMessageHTML += '<p class="big-text">Уважаемый(ая) ' + fio + ', </p><p>произошла ошибка системы.</p>';
                    finalMessageHTML += '<div class="sms-field m-t-40"><a href="/" class="button button-cancel">Закрыть</a></div>';
                }

                //ошибка, выводим текст сообщения из Fault_description
                if (status == '0') {
                    finalMessageHTML += iconFalseHTML;
                    if (text != undefined && text != '') {
                        finalMessageHTML += '<p class="big-text">Запрос отклонен</p><p>' + text + '</p>';

                    } else if (text == 'В соответствии с законодательством досрочное погашение задолженности по Вашему договору займа произведено быть не может.') {
                        finalMessageHTML += '<p class="big-text">Hет доступных типов досрочного погашения</p><p>' + text + '</p>';

                    } else {
                        finalMessageHTML += '<p class="big-text">Уважаемый(ая) ' + fio + ',</p><p>произошла ошибка системы.</p>';
                    }

                    //формируем ссылку для финального окна
                    if (code && code == '-3') {
                        finalMessageHTML += '<div class="sms-field m-t-40"><a href="/prepayment/history/" class="button button-cancel">Закрыть</a></div>';

                    } else {
                        finalMessageHTML += '<div class="sms-field m-t-40"><a href="/" class="button button-cancel">Закрыть</a></div>';
                    }

                }

                //исчерпано кол-во попыток смс подписи
                if (status == 'sms_limit') {
                    finalMessageHTML += iconFalseHTML;
                    finalMessageHTML += '<p class="big-text">Запрос отклонен.</p><p>Исчерпан лимит попыток подписи заявления.</p>';
                    finalMessageHTML += '<div class="row m-t-20"><div class="col w-50 float-right"><a href="/" class="button button-cancel m-b-0">Закрыть</a></div><div class="col w-50 float-right"><a href="/prepayment/history/" class="button button-secondary m-b-0">История досрочных погашений</a></div></div>';
                }

                //исчерпано кол-во попыток смс подписи
                if (status == 'sms_code') {
                    finalMessageHTML += iconFalseHTML;
                    finalMessageHTML += '<p class="big-text">Запрос отклонен.</p>';
                    finalMessageHTML += '<div class="sms-field m-t-40"><button class="button button-secondary repeat-sms-code">Отправить код повторно</button></div>';
                }

                //отказ от досрочного погашения
                if (status == 'reject') {
                    finalMessageHTML += iconFalseHTML;
                    finalMessageHTML += '<p class="big-text">Отказ от досрочного погашения</p><p>Запрос на досрочное погашение отозван. Данный запрос недействителен.<br> Для досрочного погашения необходимо оформить новый запрос.</p>';
                    finalMessageHTML += '<div class="sms-field m-t-40"><a href="/" class="button button-cancel">Закрыть</a></div>';
                }

                //отказ от досрочного погашения со ссылкой на главную досрочного погашения!
                if (status == 'reject_message') {
                    finalMessageHTML += iconFalseHTML;
                    finalMessageHTML += '<p class="big-text">Отказ от досрочного погашения</p><p>Запрос на досрочное погашение отозван. Данный запрос недействителен.<br> Для досрочного погашения необходимо оформить новый запрос.</p>';
                    finalMessageHTML += '<div class="sms-field m-t-40"><a href="/" class="button button-cancel">Закрыть</a></div>';
                }

                finalMessageHTML = 'div class="success-message">' + finalMessageHTML + '</div>';
                $prepaymentStepFinal.html(finalMessageHTML);

                $prepaymentStepFinal.show();

                break;

        }

        //убираем глобальный прелоадер
        $prepayment.removeClass('load');
    }

    var timerID;
    //время для таймера ЭЦП
    var timerTime = 0;
    //функция таймер для смс
    function timer(time) {
        timerTime = time;
        //если время еще есть запускаем фукнцию заново
        //иначе даем возможность повторной отправки смс кода
        if (time > 1) {
            time--;

            var seconds = time;
            var minutes = Math.floor(seconds / 60);
            seconds -= minutes * 60;

            //доп.проверки - если колво секунд 60
            if (seconds == 60) {
                minutes--;
                seconds = 59;
            }

            //форматируем значение вывода минут/секунд
            if (minutes < 10) {
                minutes = '0' + minutes;
            }
            if (seconds < 10) {
                seconds = '0' + seconds;
            }

            $timerSms.html(minutes + ':' + seconds).parent().show();
            $repeatSms.parent().hide();

            timerID = setTimeout(function () {
                timer(time);
            }, 1000);

        } else {
            clearTimeout(timerID);
            $timerSms.parent().hide();
            $repeatSms.parent().show();
        }
    }
}