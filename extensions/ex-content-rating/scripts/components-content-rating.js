/***************************************************************************************************
Extension Name: \\ex-content-rating
File: component-content-rating
Owner: Wael Gomaa
Version: 1.0.0
***************************************************************************************************/

$(document).ready(function () {
    let baseClass = ".ex-content-rating",
    titleBase = baseClass + '__title',
    expandedClass = baseClass + "--expanded", 
    form = $(baseClass).find("form");


    function showError(){
        // collpase the form 
        $(baseClass + "__content").slideUp(500);

        // remove the loader 
        form.find('[type="submit"]').addClass("button--loader");    

        // toggle message
        $(titleBase + "__question").hide();
        $(titleBase + "__message--success").hide();
        $(titleBase + "__message--error").show();
    }
    // init form requester 
    let formPlugin =  form.FormPlugin({
        errorBlock : '.field-validation-error',
        errorClass : 'input-validation-error',
        inputWrapper : '.ex-sitecore-form__input',
        // Callback functions
        onInit: function () {
        },
        beforeSend : function(){
            // adding class to submit button and disable happy btn 
            form.find('[type="submit"]').addClass("button--loader");    
            
            // disable the happy button 
            $("[data-value='happy']").addClass("accordion-trigger__disabled");
            // disable the sad button to prevent closing the form 
            $("[data-value='sad']").addClass("accordion-trigger__disabled");
            // activate loader for sad 
            // $("[data-value='sad']").children().hide();
            // $("[data-value='sad']").find(".accordion-trigger__loader").css({"display" : "block"});
        },
        onCaptchaValidate : function(response){
            // returning promise for the future implementation
            
            return !!response; 

            // return new Promise(function(resolve , reject){
            //     if(response){
            //         resolve(!!response);
            //     }else {
            //         showError();
            //         reject(false);
            //     }
            // });
        },
        onSendSuccess : function(response){
            if (response && response.status) {
                // collpase the form 
                $(baseClass + "__content").slideUp(500);

                // remove the loader 
                form.find('[type="submit"]').addClass("button--loader");    

                // toggle message
                $(titleBase + "__question").hide();
                $(titleBase + "__message--error").hide();
                $(titleBase + "__message--success").show();

                // reset form
                $(form).trigger("reset");

            }else {
                showError();    
                // throw Error(response ? response.reason : "Response is wrong");
            }
        },
        onSendError : function(err){
            console.log(err)
            showError();
        },
    }).data("FormPlugin");

 
    // on click for sad instead of accordion event subscribe 
    $(baseClass + " [data-value='sad']").on("click" , function(){
        // place the value inside the input to be serialized before submit 
        form.find("[name='FeelValue']").val('sad');
        $('.ex-content-rating__content').slideDown();
    });
    
    // unbind click expand for happy it should collapse only
    $("[data-value='happy'] .accordion-trigger__expand").unbind("click");

    // on click on happy 
    $(baseClass + " [data-value='happy']").on("click" , function(){

        var _this = this;
        
        // reset form in case of opening sad first 
        $(form).trigger("reset");

        // disable sad input
        $("[data-value='sad']").addClass("accordion-trigger__disabled");

        // collpase the form in case of happy
        $(baseClass + "__content").slideUp(500);

        // place the value inside the input to be serialized before submit 
        form.find("[name='FeelValue']").val('happy');

        // send the request by executing the plugin captcha and it will continue from there 
        if(formPlugin){
            if(formPlugin.hasCaptcha()){ // the form containing captcha to be validated first 
                try{
                       // listen to captcha loaded event
                    document.addEventListener("captcha-widget-loaded", function() {     
                        let afterExecute = grecaptcha.execute(formPlugin.getCaptcha());
                        afterExecute.then(function(){
                            // the captcha has been validated and sending process is in progress 
                            // activate loader 
                            $(_this).children().hide();
                            $(_this).find(".accordion-trigger__loader").css({"display" : "block"});

                            // reset form 
                            $(form).trigger("reset");
                        });
                    });
                    // load recaptcha if not loaded 
                    $.dispatchEvent("load-recaptcha");

                        // .catch(function(ex){
                        //     showError();
                        // }).finally(function(){
                        //     // reset form
                        //     $(form).trigger("reset");
                        // });
                }catch(ex){
                    console.log(ex);
                    // error executing the captcha 
                    showError();
                }
            }
        }

    });

    // attach click event to toggle class 
    $(baseClass + " [data-toggler]").on("click" , function(){
        let parent =  $(this).data("toggler");
        $(parent).removeClass("is-invalid").removeClass("is-valid");
        $(parent).find("input").toggleClass("validation-ignore").val("").removeClass("input-validation-error");
        $(parent).find(".field-validation-error").find(".input-validation-error").text("");
    });


    $('.ex-content-rating__content .ex-sitecore-form__input a[data-toggle]').click(function(){$('.ex-content-rating__content').slideUp();}); 
    

    
});