<?
require($_SERVER["DOCUMENT_ROOT"]."/bitrix/header.php");
$APPLICATION->SetPageProperty("description", "Оформить деньги до зарплаты онлайн и получить их  на карту в течении дня ".$seotext['inCity'].". Сумма займа от 3 000 до 14 000. Срок возврата — от 3 до 30 дней. Низкий процент, потребуется только паспорт или СНИЛС.");
$APPLICATION->SetTitle("Займ до зарплаты на карту онлайн ".$seotext['inCity']." - микрозаем до зарплаты");
?> 
        <div class="section">
            <div class="container">
                <div class="seo-content">
                    <h1 class="h1 m-b-30">Займы от МигКредит</h1>
                    <p>МигКредит предоставляет выгодные займы, получить которые Вы сможете в день обращения всего за несколько минут. Уже более 500 000 россиян воспользовались нашими услугами и положительно оценили скорость и качество обслуживания.</p>
                </div>
            </div>
        </div>

        <div class="section p-all-0">
            <div class="container">
                <form class="calculator inner load" data-calculator method="POST" action="/dengi3/">
                    <div class="shadow-block">
                        <div class="row">
                            <div class="col w-33">
                                <div class="calculator-item">
                                    <div class="calculator-row">
                                        <div class="left">
                                            <p class="big-label">Требуемая сумма</p>
                                        </div>
                                        <div class="right">
                                            <p class="big">
                                                <nobr><span data-sum>69 000</span> ₽</nobr>
                                            </p>
                                        </div>
                                        <div class="clr"></div>
                                    </div>
                                    <div class="calculator-slider">
                                        <div data-sum_slider></div>
                                    </div>
                                </div>
                            </div>
                            <div class="col w-33">
                                <div class="calculator-item center">
                                    <div class="calculator-row">
                                        <div class="left">
                                            <p class="big-label">На срок</p>
                                        </div>
                                        <div class="right">
                                            <p class="big">
                                                <nobr><span data-term>24</span> <span data-term_label>недели</span>
                                                </nobr>
                                            </p>
                                        </div>
                                        <div class="clr"></div>
                                    </div>
                                    <div class="calculator-slider">
                                        <div data-term_slider></div>
                                    </div>
                                </div>
                            </div>
                            <div class="col w-33">
                                <input type="hidden" name="calc_period_type" data-term_type value="week">
                                <button type="submit" class="button button-medium button-form uppercase">Получить
                                    деньги</button>
                            </div>
                        </div>
                    </div>
                    <div class="calculator-item result shadow-block">
                        <div class="row">
                            <div class="col w-50 after-divider">
                                <div class="calculator-row min-margin">
                                    <div class="row">
                                        <div class="col w-50 w-50-mobile">
                                            <div class="right">
                                                <p class="medium-label color-gray"><span data-result_sum_label>Платеж
                                                        раз в 2 недели</span></p>
                                            </div>
                                        </div>
                                        <div class="col w-50 w-50-mobile">
                                            <div class="left">
                                                <p class="medium">
                                                    <nobr><span data-result_sum>44 000</span> ₽</nobr>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col w-50">
                                <div class="calculator-row min-margin">
                                    <div class="row">
                                        <div class="col w-50 w-50-mobile">
                                            <div class="right">
                                                <p class="medium-label color-gray">До (включительно)</p>
                                            </div>
                                        </div>
                                        <div class="col w-50 w-50-mobile">
                                            <div class="left">
                                                <p class="medium"><span data-result_deadline>27 декабря 2019</span></p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>

        <div class="section">
            <div class="container">
                <div class="row">
                    <div class="col w-50">
                        <div class="product-card inner">
                            <span class="head">
                                <span class="fix-height">
                                    <span class="text caption">Займы онлайн</span>
                                    <span class="text with-icon">
                                        <i class="icon icon-card1"></i>
                                        До 100 000 ₽</span>
                                    <span class="text with-icon">
                                        <i class="icon icon-calendar2"></i>
                                        На срок до 1 года
                                    </span>
                                    <span class="text with-icon">
                                        <i class="icon icon-calendar3"></i>
                                        Возраст от 21 года
                                    </span>
                                </span>
                                <a href="/zajmy-onlajn/" class="button shadow-block">Подробнее</a>
                                <span class="product-bg bg-2"></span>
                            </span>
                        </div>
                    </div>
                    <div class="col w-50">
                        <div class="product-card inner">
                            <span class="head">
                                <span class="fix-height">
                                    <span class="text caption">Бизнес кредит</span>
                                    <span class="text with-icon">
                                        <i class="icon icon-card1"></i>
                                        До 300 000 ₽</span>
                                    <span class="text with-icon">
                                        <i class="icon icon-calendar2"></i>
                                        На срок до 2 лет
                                    </span>
                                    <span class="text with-icon">
                                        <i class="icon icon-calendar3"></i>
                                        Возраст от 21 года
                                    </span>
                                </span>
                                <a href="/biznes-kredit/" class="button shadow-block">Подробнее</a>
                                <span class="product-bg bg-4"></span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="section gray">
            <div class="container">
                <p class="h1 text-align-center">Наши преимущества</p>
                <div class="infographic">
                    <div class="row">
                        <div class="col w-25 w-50-mobile">
                            <div class="item">
                                <div class="icon"><i class="icon-passport"></i></div>
                                <div class="text">Быстро</div>
                                <div class="text label default">рассмотрим заявку</div>
                            </div>
                        </div>
                        <div class="col w-25 w-50-mobile">
                            <div class="item">
                                <div class="icon"><i class="icon-passport"></i></div>
                                <div class="text">Удобно</div>
                                <div class="text label default">комфортные сроки выплат</div>
                            </div>
                        </div>
                        <div class="clr hide-desktop"></div>
                        <div class="col w-25 w-50-mobile">
                            <div class="item">
                                <div class="icon"><i class="icon-passport"></i></div>
                                <div class="text">Минимум документов</div>
                                <div class="text label default">для оформления</div>
                            </div>
                        </div>
                        <div class="col w-25 w-50-mobile">
                            <div class="item">
                                <div class="icon"><i class="icon-passport"></i></div>
                                <div class="text">На карту</div>
                                <div class="text label default">возможно получение денег на карту</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="section p-b-0">
            <div class="container">
                <h2 class="bottom-border">Как взять займ?</h2>
                    <div class="seo-content">
                        <ul class="check">
                            <li>МигКредит выдает займы на карту и наличными без справок и поручителей.</li>
                            <li>Чтобы взять займ нужно минимум документов и времени. Мы гарантируем вам моментальное рассмотрение заявки — ответ на запрос придет в течение 15 минут после отправки.</li>
                            <li>Вам не нужно ехать в офис для оформления <a target="_blank" href="/dengi3/">заявки на займ</a>. Заполнить анкету можно на сайте или в нашем мобильном приложении. Укажите все необходимые данные, дождитесь принятия решения по заявке и получите денежные средства удобным Вам способом - на карту, банковский счет, через платежные сервисы и терминалы.</li>
                        </ul>
                    </div>
                <span class="show-more hide-desktop">Читать полностью<i class="icon icon-down1"></i></span> 
            </div>
        </div>
        <div class="section p-b-0">
            <div class="container">
                <h2 class="bottom-border">Условия получения займа</h2>
                    <div class="seo-content">
                        <p>В компании  МигКредит созданы все условия, чтобы вы потратили на оформление займа минимум времени. Чтобы оформить заем, нужно соответствовать всего четырем условиям:</p>
                        <ul class="check">
                            <li>иметь паспорт гражданина РФ;</li>
                            <li>быть старше 21 года;</li>
                            <li>иметь постоянный доход</li>
                        </ul>
                    </div>
                <!-- <span class="show-more hide-desktop">Читать полностью<i class="icon icon-down1"></i></span> -->
            </div>
        </div>
        <div class="section p-b-0">
            <div class="container">
                <h2 class="bottom-border">Преимущества займов от МигКредит</h2>
                    <div class="seo-content">
                        <ol>
                            <li>Вы можете самостоятельно выбирать сроки оплаты микрозайма. Для заемщиков доступны 2 способа погашения займа: <a target="_blank" href="/zajm-do-zarplaty/">единовременный платеж</a> или <a target="_blank" href="/zajmy-do-100-000-rublej/">выплата с постепенной оплатой</a>.</li>
                            <li>Получить займ наличными на руки возможно в течение часа, после подписания договора.</li>
                            <li>Обращаясь в компанию, вы получаете лояльного к вам кредитора – надежного партнера, к которому вы всегда сможете обратиться со своими финансовыми вопросами.</li>
                            <li>Бонусы, подарки и скидки – неотъемлемая часть клиентского сервиса компании, потому что МигКредит ценит своих клиентов.</li>
                        </ol>
                    </div>
                <span class="show-more hide-desktop">Читать полностью<i class="icon icon-down1"></i></span>
            </div>
        </div>


            <?require($_SERVER["DOCUMENT_ROOT"]."/bitrix/footer.php");?>
