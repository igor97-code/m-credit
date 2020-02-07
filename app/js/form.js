// var regEmail = /^(([^<>()\\[\\]\\\\.,;:\\s@\"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@\"]+)*)|(\".+\"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$/i;
var regEmail = /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,}$/i;
var regName = /^[a-zA-Z\s]+$/i;
var regNameRus = /^[А-Яа-яЁё\-'\s]+$/i;
var regPass = /^[a-zA-Z0-9]+$/i;
var regPass = /^[a-zA-Z0-9]+$/i;
var regDate = /(\d{2}\.\d{2}\.\d{4})/;
var regNum = /^\d+$/;
var regCardSum = /^[0-9\.\,]+$/;
var regSNPassport = /(\d{4}\s\d{6})/;
var regCodePassport = /(\d{3}\-\d{3})/;
var regSnils = /(\d{3}\-\d{3}\-\d{3}\s\d{2})/;

var regRusfield = /^[А-Яа-яЁё0-9\-\s.]+$/i;
var regAddressNum = /^[А-Яа-яЁё0-9\-\/().]+$/i;

function validateForm($form) {
    var error = 0;
    $form.find('input, select, textarea').filter(':visible').each(function () {
        if (!$(this).hasClass('validate')) return false;
        // if ($(this).prop('readonly') || !$(this).filter(':visible').length) return false;

        if (!validateField($(this))) {
            error++;
        }
    });

    if (error > 0) {
        return false;

    } else {
        return true;
    }
}

//функция проверки корректности заполненения полей
//на вход тип проверки, значение, placeholder
function validateField($field) {
    if (!$field.hasClass('validate')) return false;

    var error = 0,
        message = '';

    var val = jQuery.trim($field.val()),
        plh = $field.data('placeholder'),
        type = $field.data('validate'),
        errorMessage = $field.attr('data-error_message');

    switch (type) {

        //обязательно для заполнения
        case 'required':
            if (!val) {
                error++;
                message = 'Поле обязательно для заполнения';
            }
            break;

        //только число
        case 'number':
            val = getClearVal(val);
            if (val === '' || val.search(regNum) == -1) {
                error++;
                message = 'Только цифры';
            }
            break;

        //номер телефона
        case 'mobile_phone':
            val = getClearVal(val);
            if (val == '' || val.search(regNum) == -1 || val.length != 10 || val[0] == 0 || val[0] == 1 || val[0] == 2 || val[0] == 7) {
                error++;
                message = 'Укажите корректный номер телефона';
            }
            break;

        //номер телефона необязательное
        case 'mobile_phone_empty':
            val = getClearVal(val);
            if (val) {
                if (val.search(regNum) == -1 || val.length != 10 || val[0] == 0 || val[0] == 1 || val[0] == 2 || val[0] == 7) {
                    error++;
                    message = 'Укажите корректный номер телефона';
                }
            }

            break;

        case 'date':
            //проверка поля
            if (!val|| val.search(regDate) == -1){
                error++;
                message = 'Дата в формате дд.мм.гггг';

            }
            break;

        //дата рождения
        case 'date_birthday':
            if (val.search(regDate) == -1) {
                error++;
                message = 'Дата в формате дд.мм.гггг';

            } else {
                var d = val.split('.');
                //месяц с 0 поэтому вычитаем
                var day = d[0] * 1;
                var month = d[1] * 1 - 1;
                var year = d[2] * 1;

                var dateCur = moment([year, month, day]);
                var dateNow = moment();

                //проверка на корректность даты
                if (dateCur.isValid() == 'Invalid date' || dateCur.isValid() == false || dateCur > dateNow) {
                    error++;
                    message = 'Укажите верную дату'

                } else if (dateNow.diff(dateCur, 'years') < 18) {
                    error++;
                    message = 'Возраст не менее 18 лет';
                }
            }

            break;

        //email
        case 'email':
            if (val == '' || val.search(regEmail) == -1 || val.length > 50) {
                error++;
                message = 'Укажите корректный адрес электронной почты';
            }
            break;

        // checkbox
        case 'checkbox':
            var $checkbox = $field.parent().find('input:checked');
            if (!$checkbox.length) {
                error++;
                message = 'выберите вариант';
            }
            break;

        /*русские символы + спец.символы для фио*/
        case 'rusfield':
            if (val == '' || val.search(regNameRus) == -1 || val.length > 50 || val.length < 2) {
                error++;
                message = 'Только русские буквы, до 50 символов';
            }
            break;

        /*№ договора*/
        case 'number_dogovor':
            //проверка поля
            var firstSymbol = val.substr(0, 1);
            var otherSymbol = val.substr(1, val.length - 1);

            if (val.length == 10 && (firstSymbol == 'S' || firstSymbol.search(regNum) != -1) && otherSymbol.search(regNum) != -1) {

            } else {
                error++;
                message = 'Номер договора должен содержать десять цифр, <br>код услуги состоит из буквы S и девяти цифр';
            }

            break;

        /*№ договора*/
        case 'number_dogovor_empty':
            //проверка поля
            if (val) {
                var firstSymbol = val.substr(0, 1),
                    otherSymbol = val.substr(1, val.length - 1);

                if (val.length == 10 && (firstSymbol == 'S' || firstSymbol.search(regNum) != -1) && otherSymbol.search(regNum) != -1) {

                } else {
                    error++;
                    message = 'Номер договора должен содержать десять цифр, <br>код услуги состоит из буквы S и девяти цифр';
                }
            }

            break;

        //пароль
        case 'password':
            val = getClearVal(val);
            //проверка на латиницу/цифры
            if (val.search(regPass) == -1 || !val.match(/[0-9]+/) || !val.match(/[A-Z]+/) || val.length < 8) {
                error++;
                message = 'Не менее 8 знаков, минимум 1 заглавная буква и 1 цифра';
            }

            break;

        //денежный формат
        case 'money':
            val = getMoneyInputValue($field);
            if (!val || val.search(regNum) === -1) {
                error++;
                message = 'Только цифры';
            }
            break;
    }

    // еслии задано кастомное сообщение об ошибке - выводим его
    if (errorMessage) message = errorMessage;

    //если поле заполнено не корректно
    //возвращаем 
    if (error > 0) {
        $field.parents('.field').find('.error-message').text(message);
        $field.parents('.field').removeClass('success').addClass('error');

        return false;

    } else {
        $field.parents('.field').removeClass('error').addClass('success');
        $field.parents('.field').find('.error-message').text('');

        return true;
    }
}

//ф-я очистки формы
//на вход объект формы
function clearForm($form) {
    $form.find('.validate').each(function () {
        var plh = $(this).data('placeholder');
        var val = '';
        if (plh != undefined) {
            //val = plh;
        }
        //console.log(val);
        $(this).val('').parents('.field').removeClass('success error').addClass('empty');
    });
}

// custom placeholders
function initPlaceholders() {
    $('.placeholder').each(function () {
        if ($(this).hasClass('ready')) return;

        var $this = $(this);

        var $field = $this.parents('.field');
        var plh = $this.data('placeholder');
        var val = $.trim($this.val());
        if ((val == '' || val == plh) && plh != '' && plh != undefined) {
            $field.addClass('empty');

        } else {
            $field.removeClass('empty');
        }

        $field.prepend('<span class="label">' + plh + '</span>');

        $(this).addClass('ready');

        $(this)
            .on('focus', function () {

                var $this = $(this),
                    $field = $this.parents('.field'),
                    plh = $this.attr('data-placeholder'),
                    val = $.trim($this.val());

                if ($this.prop('readonly')) return false;

                if (val == '' || val == plh) {
                    $field.removeClass('empty');
                }
            })
            .on('blur', function () {
                var $this = $(this),
                    $field = $this.parents('.field'),
                    plh = $this.attr('data-placeholder'),
                    val = $.trim($this.val());

                if (val == '' || val == plh) {
                    $field.removeClass('error success').addClass('empty');

                } else {
                    $field.removeClass('empty');
                }
            });
    });

    $('.placeholder-select').each(function () {
        if ($(this).hasClass('ready')) return;

        var $this = $(this),
            $field = $this.parents('.field'),
            plh = $this.attr('data-placeholder'),
            val = $.trim($this.val());

        if ((val == '' || val == plh) && plh != '' && plh != undefined) {
            $field.addClass('empty');

        } else {
            $field.removeClass('empty');
        }

        $field.find('.selectwrap').prepend('<span class="label">' +  plh + '</span>');

        $this.addClass('ready');

        $this
            .on('focus', function () {
                var $this = $(this),
                    $field = $this.parents('.field');
                plh = $this.attr('data-placeholder'),
                    val = $this.val();

                if ($this.prop('readonly')) return false;

                if (val == '' || val == plh) {
                    $field.removeClass('empty');
                }
            })
            .on('blur', function () {
                var $this = $(this);
                setTimeout(function () {
                    var $field = $this.parents('.field'),
                        val = $this.val(),
                        plh = $this.attr('data-placeholder');

                    if (!val || val == plh) {
                        $field.removeClass('error success').addClass('empty');

                    } else {
                        $field.removeClass('empty');
                    }
                }, 150);
            });
    });
}

// маска ввода
// на вход поле ввода с data-mask="маска ввода" или шаблоном маски ввода
// в приоритете шаблон 0 data-mask_tpl="phone"
// далее кастомная  data-mask="+7 (999) 999 99 99"
function initMask() {
    $('.input-mask').each(function () {
        var $field = $(this);
        if ($field.hasClass('mask-ready')) return;

        var maskTpl = $field.attr('data-mask_tpl'),
            mask = $field.attr('data-mask');

        if (!maskTpl && !mask) return;

        switch (maskTpl) {
            case 'phone_plus7':
                mask = '+7 (999) 999 9999';
                break;

            case 'phone':
                mask = '(999) 999 9999';
                break;

            case 'date':
                mask = '99.99.9999';
                break;

            case 'passport_code':
                mask = '999-999';
                break;

            case 'passport_serial_number':
                mask = '9999 999999';
                break;
        }

        $field
            .inputmask({
                mask: mask,
                placeholder: '_',
                showMaskOnHover: false,
                showMaskOnFocus: true
            });
    });
}

// Дененжный формат
function initMoneyInput() {
    $('.input-money').each(function () {
        var $field = $(this);
        if ($field.hasClass('mask-ready')) return;

        $field
            .inputmask({
                alias: 'numeric',
                digits: 0,
                digitsOptional: false,
                radixPoint: '.',
                placeholder: '',
                groupSeparator: ' ',
                autoGroup: true,
                min: 0,
                max: 999999,
                suffix: ' ₽',
                allowMinus: false,
                rightAlign: false,
                showMaskOnHover: false
            });

        $field.addClass('mask-ready');
    });

// очистка значения от спецсимволов(маски ввода)
function getClearVal(val) {
    var result = val;
    result = result.replace('+7', '');
    result = result.replace(/[()\_\-\s]/g, '');
    return result;
}

/**
 * Получение значения с инпата в денежном формате
 * @param {HTMLElement} $input - сам инпат
 * @result {Number} value input
 */
function getMoneyInputValue($input) {
    return +$input.inputmask('unmaskedvalue') || 0;

}
}