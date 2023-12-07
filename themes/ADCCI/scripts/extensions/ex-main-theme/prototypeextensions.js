
/***************************************************************************************************
Extension Name: \\ex-main-theme
File: prototypes.extensions
Owner: Wael Gomaa
Version: 1.0.0
***************************************************************************************************/


// adding prototype to number class
Number.prototype.isBetween = function (min, max) {
    if (typeof min == "undefined" || typeof max == "undefined") {
        return false;
    }
    return this.valueOf() >= min && this.valueOf() <= max;
};




$(document).ready(function () {
    
    $.getQueryString = function (param){
        var url = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&'); 
        for (var i = 0; i < url.length; i++) {  
            var splited = url[i].split('=');  
            if (splited[0].toLocaleLowerCase() == param.toLocaleLowerCase()) {  
                return splited[1];  
            }  
        }
    }

    $.getQueryString = function (param){
        var url = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&'); 
        for (var i = 0; i < url.length; i++) {  
            var splited = url[i].split('=');  
            if (splited[0].toLocaleLowerCase() == param.toLocaleLowerCase()) {  
                return splited[1];  
            }  
        }
    }

    // JQ helpers fncs 
    $.fn.replaceClass = function (pFromClass, pToClass) {
        return $(this).removeClass(pFromClass).addClass(pToClass);
    };

    // JQ validate 
    if ($.validator) {
        $.validator.methods.pattern = function (value, element) {
            var relatedInput = $(element).data("relatedInput");
            var pattern = $(element).attr("pattern");
            if (relatedInput && ($(relatedInput).is(':checked') || $(relatedInput).val())) {
                var regx = new RegExp(pattern);
                let value = (element.value || "").trim().replace(" ", "");
                if (value) {
                    return regx.test(value);
                }
            }
            return true;
        }

        // TO BE : Deprecated 
        $.validator.methods.phone = function (value, element) {
            // return this.optional(element) || /^(?:\+0)(?:2|3|4|6|7|9|50|51|52|55|56|58)[0-9]{7}$/.test(value);
            var relatedInput = $(element).data("relatedInput");
            if (relatedInput && ($(relatedInput).is(':checked') || $(relatedInput).val())) {
                var regx = new RegExp("[0-9]")
                return element.value.length <= 15 && element.value.length >= 9 && regx.test(element.value);
                // return /^(?:\+0)(?:2|3|4|6|7|9|50|51|52|55|56|58)[0-9]{7}$/.test(value);
                // return true;
            }
            return this.optional(element);
        }
    }
});
