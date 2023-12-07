/***************************************************************************************************
Extension Name: \\ex-happiness-meter
File: component-happiness-meter
Owner: Wael Gomaa
Version: 1.0.0
***************************************************************************************************/


$(document).ready(function () {

    // extension 
    $.fn.clearValidation = function(){var v = $(this).validate();$('[name]',this).each(function(){v.successList.push(this);v.showErrors();});v.resetForm();$(this).trigger("reset");};

    var current = $(".happiness-meter-input__count .happiness-meter-input__count__current"),
    total = $(".happiness-meter-input__count .happiness-meter-input__count__total");

    $(".happiness-meter-form .happiness-meter-input textarea").keyup(function () {
        var characterCount = $(this).val().length,
        maxlength = $(this).attr("maxlength");

        // set total
        total.text(maxlength);
        // update the current text
        current.text(characterCount);

        // exceeded the limits class
        if (characterCount >= maxlength) {
            current.addClass("error");
        } else {
            current.removeClass("error");
        }     
    });
    $(".happiness-meter-form .happiness-meter-input textarea").keyup();


    // on trigger change :  toggle validation ignore 
    $("#enableMobile").on("change" , function(){
        if($(this).is(":checked")){
            $("[data-related-input='#enableMobile']").removeClass("happiness-validation-ignore");
        }else {
            $("[data-related-input='#enableMobile']").addClass("happiness-validation-ignore");
        }
    });

    // helpers fncs 
    $.fn.showError = function () {
        return this.parent().replaceClass('is-valid', 'is-invalid');
    };
    $.fn.showSuccess = function () {
        return this.parents().replaceClass('is-invalid', 'is-valid');
    };
    $.fn.replaceClass = function (pFromClass, pToClass) {
        return this.removeClass(pFromClass).addClass(pToClass);
    };


    var rtl = $.checkSiteRTLDirection(),
        lang = $("html").attr("lang").toLocaleLowerCase();

    var selector = '[data-meter]',
        happinessMeterContainer = 'ex-happiness-meter',
        happinessMeterContainerSingleView = happinessMeterContainer + '--singlecolor-view',
        form = $('.' + happinessMeterContainer + ' form'),
        errorBlock = '.error-block',
        faceMargin = 16,
        meterValue = 0,
        meterLabel = '',
        happinessMapper = {
            0: {
                'en': 'Very Sad',
                'he-il': 'עצוב מאוד',
                'ar-ae': 'مستاء جدا',
            },
            1: {
                'en': 'Sad',
                'he-il': 'עָצוּב',
                'ar-ae': 'مستاء',
            },
            21: {
                'en': 'Unhappy',
                'he-il': 'אוּמלָל',
                'ar-ae': 'غير راض',
            },
            41: {
                'en': 'Neutral',
                'he-il': 'ניטראלי',
                'ar-ae': 'محايد',
            },
            61: {
                'en': 'Happy',
                'he-il': 'שַׂמֵחַ',
                'ar-ae': 'سعيد',
            },
            100: {
                'en': 'Exited',
                'he-il': 'יצא',
                'ar-ae': 'سعيد جدا',
            }
        },
        happinessMapperKeys = Object.keys(happinessMapper);

        // capotsha callback
    function captchaCallback(response) {
        if(response){
            if (!firstStep) {
                // set the response to hidden input 
                // form step
                responseInput.val(response);
            }
            else {
                // slider step
                if (response && response.length > 5) { // !!! why 5 ?
                    
                    var formData = new FormData();
                    formData.append("FeelValue", meterLabel);
                    formData.append("FeelPrecent", meterValue);
                    formData.append("phonenumber", '');
                    formData.append("EmailContent", '');
                    formData.append("CurrentUrl", document.location.href);
                    formData.append("CurrentPageName", '');
                    formData.append("UserEmail", '');
                    formData.append("currentItemPath", '');
                    formData.append("recaptcha",response);
                
                    send(formData, true);

                    $(".ex-happiness-meter__content").hide();
                    $(".ex-happiness-meter__form").show();
                    $(".ex-happiness-meter .happiness-meter-form").addClass("hidden");
                    // reset the fist step to false
                    firstStep = false;

                }
            }
        }else{ 
            showError();
        }
    }

    function showError() {
        $(".happiness-meter-message__label").hide();
        $(".happiness-meter-error").show();
        $(".happiness-meter-form").addClass("hidden");
        $(".happiness-meter-message__icon").children()
            .removeClass("icon-check-circle-filled")
            .removeClass("spinner-grow")
            .addClass("icon-delete-filled");
    }
    function showSuccess() {
        $(".happiness-meter-message__label").show();
        $(".happiness-meter-error").hide();
        $(".happiness-meter-form").removeClass("hidden");
        $(".happiness-meter-message__icon").children()
            .removeClass("spinner-grow")
            .removeClass("icon-delete-filled")
            .addClass("icon-check-circle-filled")
    }
    function showLoading() {
        $(".happiness-meter-message__icon").children()
            .removeClass("icon-delete-filled")
            .removeClass("icon-check-circle-filled")
            .addClass("spinner-grow");
    }

    function goForDialog(msg) {
        // reset capotsha
        (capotshaWidget != null && typeof grecaptcha != 'undefined') && grecaptcha.reset(capotshaWidget);
        responseInput.val('');

        if (msg && $.dialog) {

            $.dialog({
                dialogClass: "p-3",
                dialogOkButtonClass : "mt-2",
                dialogFooterClass : "m-0",
                dialogFooterClass : "d-flex justify-content-center",
                message: "<p>" + $(form).attr(msg) + "</p>",
                okButton: $(form).attr("data-ok-button"),
                callback: function (value) {
                    if (value) {
                        $.fancybox.close();
                        $(form).clearValidation();
                        $("#enableMobile").prop("checked", false).change();
                        $(form).find('.is-valid , .is-invalid').removeClass('is-valid').removeClass('is-invalid')
                        $(form).trigger("reset");
                    }
                }
            });
        }
    }

    function send(data, silentMode) {

        $(".happiness-meter-error").hide();
        $(".happiness-meter-message__label").hide();
        try {
            var url = $(form).attr("action");
            $.ajax({
                processData: false,
                contentType: false,
                type: "POST",
                url: url,
				data: data,
                success: function (response) {
                    if (response.toLocaleLowerCase() == "true") {
                        showSuccess();
                        if (!silentMode) {
                            goForDialog('data-success-message');
							firstStep = true;
                        } else {
                            showSuccess();
                        }
                    } else {
                        if (!silentMode) {
                            goForDialog('data-error-message');
                        } else {
                            // logical error
                            showError();
                        }
                    }

                    // reset the slider in all cases 
                    resetSlider($('.'+ happinessMeterContainer + " [data-meter]"));

                },
                error: function (error) {
                    showError();
                    if (!silentMode) {
                        goForDialog('data-error-message');
                    }
                },
            });
        } catch (ex) {
            $(".happiness-meter-error").show();
            $(".happiness-meter-message__label").hide();
        }
    }
    function resetSlider(instance) {
        if(instance){
            $(instance).removeAttr("disabled");
            $(instance).val(50).change();
            $(instance).rangeslider('update', true);
            $("." + happinessMeterContainer).addClass(happinessMeterContainerSingleView);
        }
    }

    function getValueLabel(value, language) {
        if (happinessMapper[value]) {
            return happinessMapper[value][language];
        } else {
            for (var i = 0; i < happinessMapperKeys.length; i++) {
                if (happinessMapperKeys[i + 1]) {
                    if (value.isBetween(parseInt(happinessMapperKeys[i]), parseInt(happinessMapperKeys[i + 1]))) {
                        return happinessMapper[happinessMapperKeys[i]][language];
                    }
                }
            }
        }

    }
    // init capotsha
    var hiddenCaptchaID = 'dvHiddenCaptcha';
    var capotshaID = 'happiness-recaptcha',
        responseInput = $('#' + capotshaID + '-input'),
        firstStep = true,
        capotshaWidget = null;
        capotshaHiddenWidget = null;

        // init capotsha after 1sec to avoid loading errors 
        document.addEventListener("grecaptcha-loaded", function () {
            if(typeof grecaptcha != 'undefined'){
                // check if the div is there to init capotsha
                grecaptcha.ready(function(){
                    if(document.getElementById(capotshaID) && capotshaWidget == null){
                        capotshaWidget = grecaptcha.render(capotshaID, {
                            'sitekey': $(responseInput).data("sitekey"), //"6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI",
                            'callback': captchaCallback,
                            'theme': 'light'
                        });
                    }
                    if(document.getElementById(hiddenCaptchaID) && capotshaHiddenWidget == null){
                        capotshaHiddenWidget = grecaptcha.render(hiddenCaptchaID, {
                            'sitekey': $(responseInput).data("sitekey"), //"6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI",
                            'callback': captchaCallback,
                            'size': "invisible",
                            'theme': 'light'
                        });
                    }
                                    
                });
            } else {
                showError();
            }
        });
       

    // current url init 
    $("#txtCurrentUrl").val(document.location.href);

    
    $(form).validate({
        lang: rtl ? 'ar' : 'en',
        errorElement: 'span',
        errorClass: 'input-error',
        validClass: "input-success",
        ignore  : ".happiness-validation-ignore",
        // focusCleanup: false, //Enables cleanup when focusing elements
        // errorLabelContainer: '.help-block',
        errorPlacement: function (error, element) {
            error.appendTo(element.parent().find(errorBlock));
            $(element).showError();
        },
        onfocusout: function (ele) {
            if ($(ele).valid()) {
                $(ele).showSuccess();
            } else {
                $(ele).showError();
            }
        },
        onkeyup: function (ele) {
            if ($(ele).valid()) {
                $(ele).showSuccess();
            } else {
                $(ele).showError();
            }
        },
        success: function (label) {
            $(label).showSuccess();
        },
        submitHandler: function (form) {

            // validate captcha
            if (!responseInput.val()) {
                var msg = $(responseInput).data("msgRequired");
                $(responseInput).parent().find(errorBlock).text(msg);
                $(responseInput).showError();
                return;
            } else {
                $(responseInput).showSuccess();
            }

            // disable submit button 
            $(form).find(".happiness-meter-submit").attr("disabled", "disabled");

            /////////end of validate captcha 
            // var data = $(form).serialize();
            var data = {}
            var formData = new FormData();
            
            var dataWrapper = $('[data-wrapper] input[type=hidden]');
            for(var i=0; i < dataWrapper.length; i++){
                formData.append(dataWrapper[i].name, dataWrapper[i].value);
                // data[dataWrapper[i].name] = dataWrapper[i].value
            }
            formData.append("FeelValue",  getValueLabel(meterValue, "en"));
            formData.append("FeelPrecent",  meterValue);
            formData.append("EmailContent", $("[name='EmailContent']").val());
            formData.append("phonenumber",  $("[name='phonenumber']").val());
            formData.append("recaptcha", responseInput.val());
            
            send(formData);

        }
    });

    $("[data-happiness-trigger]").on("click", function () {

        // load recaptcha on button click 
        $.dispatchEvent("load-recaptcha");

        if (typeof Scrollbar != "undefined") {
            let instanceScrollbar = Scrollbar.get($("." + happinessMeterContainer)[0]);
            if(instanceScrollbar) { 
                instanceScrollbar.destroy();
                Scrollbar.init($("." + happinessMeterContainer)[0]);
            }
        }
        $(".ex-happiness-meter__content").show();
        $(".ex-happiness-meter__form").hide();
        //reset inputs
        $(form).clearValidation();
        $(".ex-happiness-meter__form").find("input:checked").click();
        
        $("." + happinessMeterContainer).addClass(happinessMeterContainerSingleView);

        // enable submit  button 
        $(form).find(".happiness-meter-submit").removeAttr("disabled");

        // reset slider 
        var sliderInput  = $('.'+ happinessMeterContainer + " [data-meter]");
        if(sliderInput.val() != 50){
            // reset slider again
            resetSlider(sliderInput);
            // reseting slider will trigger onslide and remove singleview class 
            // adding it again
            $("." + happinessMeterContainer).addClass(happinessMeterContainerSingleView);
        }
        $(".happiness-meter-slider__fill").width("100%");

        // reset current count 
        current.text("0");
        
        // set the first step tb be true again
        firstStep = true;
    });

    $(".happiness-meter-checkbox input[type='checkbox']").on("change", function () {
        if (this.checked) {
            $(".happiness-meter-input--mobile").css("display", "flex");
        } else {
            $(".happiness-meter-input--mobile").css("display", "none");
        }
    });

    $(selector).each(function (idx, instance) {

        var min = $(instance).attr("min") || 0,
            max = $(instance).attr("max") || 100,
            step = $(instance).attr("step") || 100,
            initialValue = $(instance).attr("value") || 0;

        // set intial value for face 
        animateFace(initialValue);


        function animateFace(value) {
            var face = $(".happiness-meter-face__image");
            var height = face.height() + faceMargin;
            var amount = parseInt(value / 2) * height;
            face.css("backgroundPosition", '0% -' + amount + 'px');
        }

        $(instance).rangeslider({

            polyfill: false,
            revert: true,
            rtl: rtl,
            width: $(".ex-happiness-meter__content__footer").width(),

            // Default CSS classes        
            rangeClass: 'happiness-meter-slider',
            activeClass: 'happiness-meter-slider--active',
            disabledClass: 'happiness-meter-slider--disabled',
            horizontalClass: 'happiness-meter-slider--horizontal',
            verticalClass: 'happiness-meter-slider--vertical',
            revertClass: 'happiness-meter-slider__fill--revert',
            fillClass: 'happiness-meter-slider__fill',
            handleClass: 'happiness-meter-slider__handle',

            // Callback function
            onInit: function () {
            },
            // Callback function
            onSlide: function (position, value) {
                $("." + happinessMeterContainer).removeClass(happinessMeterContainerSingleView);

                $(".happiness-meter-notice").hide();
                $(".happiness-meter-value").show();

                animateFace(value);
                let label = getValueLabel(value, lang);
                $("[name='FeelValue']").val(label);
                $(".happiness-meter-value").text(label);
            },
            // Callback function
            onSlideEnd: function (position, value) {
                // disable 
                $(instance).attr("disabled" , "disabled");

                showLoading();

                // get meter label & precentage
                meterLabel = getValueLabel(value, "en");
                meterValue = value;
             
                // add the single view color 
                $('.' + happinessMeterContainer).addClass(happinessMeterContainerSingleView);

                // execute hidden capotsha 
                if(capotshaHiddenWidget != null && typeof grecaptcha != 'undefined'){
                    grecaptcha.execute(capotshaHiddenWidget);
                }else {
                    // should show an error as the capotsha didn't initialized 
                    
                }
                
            }
        });
    });
});