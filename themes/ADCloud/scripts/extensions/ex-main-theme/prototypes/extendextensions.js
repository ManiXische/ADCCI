/***************************************************************************************************
Extension Name: \\ex-main-theme
File: extend.extensions
Owner: Wael Gomaa
Version: 1.0.0
***************************************************************************************************/

$(document).ready(function () {
    // extending all messages 
    var rtl = $.checkSiteRTLDirection();
    if ($.validator) {
        $.extend($.validator, {
            required: "This fields is required.",
            remote: "Please fix this field.",
            email: "Please enter a valid email address.",
            url: "Please enter a valid URL.",
            date: "Please enter a valid date.",
            dateISO: "Please enter a valid date (ISO).",
            number: "Please enter a valid number.",
            digits: "Please enter only digits.",
            creditcard: "Please enter a valid credit card number.",
            equalTo: "Please enter the same value again.",
            contenttype : 'File type should be {0}',
            filesize : 'File size should not exceed {0} byte',
            recaptcha : 'Please check captcha again',
            extension: "Please attach file with corresponding extenion",
            accept: "Please enter a value with a valid extension.",
            maxlength: jQuery.validator.format("Please enter no more than {0} characters."),
            minlength: jQuery.validator.format("Please enter at least {0} characters."),
            rangelength: jQuery.validator.format("Please enter a value between {0} and {1} characters long."),
            range: jQuery.validator.format("Please enter a value between {0} and {1}."),
            max: jQuery.validator.format("Please enter a value less than or equal to {0}."),
            min: jQuery.validator.format("Please enter a value greater than or equal to {0}.")
        });

        if(rtl){
            $.extend( $.validator.messages, {

                required: "هذا الحقل إلزامي",
                remote: "يرجى تصحيح هذا الحقل للمتابعة",
                email: "يرجى إدخال عنوان بريد إلكتروني صحيح",
                url: "رجاء إدخال عنوان موقع إلكتروني صحيح",
                date: "رجاء إدخال تاريخ صحيح",
                dateISO: "رجاء إدخال تاريخ صحيح (ISO)",
                number: "رجاء إدخال عدد بطريقة صحيحة",
                digits: "رجاء إدخال أرقام فقط",
                creditcard: "رجاء إدخال رقم بطاقة ائتمان صحيح",
                equalTo: "رجاء إدخال نفس القيمة",
                contenttype : ' يجب أن يكون الملف من نوع {0} ',
                filesize : 'يجب أن لا يتعدي حجم الملف {0} بايت',
                recaptcha : 'من فضلك قم بتآكيد كود التحقق',
                extension: "رجاء إدخال ملف بامتداد موافق عليه",
                accept: "رجاء إدخال ملف بامتداد موافق عليه",
                maxlength: $.validator.format( "الحد الأقصى لعدد الحروف هو {0}" ),
                minlength: $.validator.format( "الحد الأدنى لعدد الحروف هو {0}" ),
                rangelength: $.validator.format( "عدد الحروف يجب أن يكون بين {0} و {1}" ),
                range: $.validator.format( "رجاء إدخال عدد قيمته بين {0} و {1}" ),
                max: $.validator.format( "رجاء إدخال عدد أقل من أو يساوي {0}" ),
                min: $.validator.format( "رجاء إدخال عدد أكبر من أو يساوي {0}" ),
                    } );
        } 
    }
});