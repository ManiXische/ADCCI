
$(document).ready(function () {
    document.addEventListener("load-recaptcha", function(){
        if(typeof grecaptcha == "undefined"){
            $("body").append('<script>var onloadCallback = function() {' +
                'var event;' +
                'if (typeof(Event) === "function") {' +
                'event = new Event("grecaptcha-loaded");' +
                    '} else {' +
                'event = document.createEvent("Event");' +
                    'event.initEvent("grecaptcha-loaded", true, true);' +
                    '};' +
                'document.dispatchEvent(event);' +
            '};</script>');
            
            if($("html").attr("lang").toLowerCase()=="en"){
                $('body').append('<script src="https://www.google.com/recaptcha/api.js?onload=onloadCallback&render=explicit&hl=en" async defer ></script>');
            }else{
                $('body').append('<script src="https://www.google.com/recaptcha/api.js?onload=onloadCallback&render=explicit&hl=ar" async defer ></script>');
            }
        }
    });
});


  
    