/***************************************************************************************************
Extension Name: \\ex-sitecore-form
File: component-sitecore-form-plugin
Owner: Wael Gomaa
Version: 1.0.0
***************************************************************************************************/


(function(factory) {
    'use strict';

    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // CommonJS
        module.exports = factory(require('jquery'));
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function($) {
    'use strict';

    var pluginName = 'FormPlugin',
        defaults = {
            errorElement: 'span',
            errorClass: 'input-error',
            inputWrapper : '.input-box',
            validClass: "input-success",
            errorBlock : '.error-block',
            validCssClass : 'is-valid',
            invalidCssClass : 'is-invalid',
            captchaWrapper :'.captcha-wrapper',
            captchaTheme : 'light',
            


            onValidateError : jQuery.noop(),
            onCaptchaValidate : jQuery.noop(),
            onInit : jQuery.noop(),
            beforeSend : jQuery.noop(),
            afterSend : jQuery.noop(),
            sending : jQuery.noop(),
            onSendSuccess : jQuery.noop(),
            onSendError : jQuery.noop(),
            dialogDismissed : jQuery.noop(),
            

        },
        _this;

    /**
     * FormPlugin
     * @param {String} form
     * @param {Object} options
     */
    function FormPlugin(form, options) {
        _this                   = this;
        this.$window            = $(window);
        this.$document          = $(document);
        this.$form              = $(form);
        this.options            = $.extend( {}, defaults, options );

        this.onInit             = this.options.onInit || jQuery.noop();
        this.sending            = this.options.sending || jQuery.noop();
        this.beforeSend         = this.options.beforeSend || jQuery.noop();
        this.afterSend          = this.options.afterSend || jQuery.noop();
        this.onSendSuccess      = this.options.onSendSuccess || jQuery.noop();
        this.onSendError        = this.options.onSendError || jQuery.noop();
        this.onCaptchaValidate  = this.options.onCaptchaValidate || jQuery.noop();
        this.dialogDismissed    = this.options.dialogDismissed || jQuery.noop();
   
        // init the plugin
        this.init();
    }
    // prototypes 
    FormPlugin.prototype.showError = function(element){
        return $(element).parents(this.options.inputWrapper).replaceClass(this.options.validCssClass, this.options.invalidCssClass);
    };
    FormPlugin.prototype.showSuccess = function(element){
        return $(element).parents(this.options.inputWrapper).replaceClass(this.options.invalidCssClass, this.options.validCssClass);
    };
    FormPlugin.prototype.replaceClass = function(pFromClass, pToClass){
        return $(element).removeClass(pFromClass).addClass(pToClass);
    };
    FormPlugin.prototype.init = function() {

        this.placeCaptcha();

        if (jQuery.fn.validate != undefined){
            this.initValidate();
        }else {
            // in case of missing the validate library 
            // follow the simple submit
            this.$form.on("submit" , function(evt){
                evt.preventDefault();
                _this.submit();
            })
        }

        if (jQuery.fn.validate != undefined){
            this.resetForm();
        }
        
        if (this.onInit && typeof this.onInit === 'function') {
            this.onInit();
        }
    };
    FormPlugin.prototype.placeCaptcha = function(){
        document.addEventListener("grecaptcha-loaded", function() { 
            if(_this.$form.find(_this.options.captchaWrapper).length){
                // captcha wrapper is exists 
                _this.captchaWrapper = _this.$form.find(_this.options.captchaWrapper);
                var inputName = _this.captchaWrapper.data("name"),
                sitekey = _this.captchaWrapper.data("sitekey"),
                size = _this.captchaWrapper.data("size"),
                guid  = $.guid++;
                
                _this.captchaMsg = _this.captchaWrapper.data("msgRequired");
                _this.captchaID = "captcha-div-" +  guid;
                _this.captchaInputID = "captcha-input-" +  guid;
    
                // place captcha div
                $("<div/>" , {
                    id : _this.captchaID,
                }).appendTo(_this.captchaWrapper);
                // place captcha input
                _this.captchaInput = $("<input />", {
                    name : inputName,
                    type : "hidden",
                    id : _this.captchaInputID
                });
                _this.captchaInput.appendTo(_this.captchaWrapper);
                // place error block
                $("<div/>" , {
                    "class" : _this.options.errorBlock.replace("." , "") + " my-2",
                }).appendTo(_this.captchaWrapper);
    
                // init captcha when it's ready
                _this.captchaWidget = grecaptcha.render(_this.captchaID, {
                    'sitekey': sitekey, //"6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI",
                    'callback': _this.captchaCallback,
                    'theme': _this.options.captchaTheme,
                    'size': size, //"invisible",
                });
                
                $.dispatchEvent("captcha-widget-loaded");
            }
        });
    };
    FormPlugin.prototype.getCaptcha = function(){
        return this.captchaWidget;
    }
    FormPlugin.prototype.hasCaptcha = function(){
        return _this.$form.find(_this.options.captchaWrapper).length > 0;
    }
    FormPlugin.prototype.resetCaptcha = function(){
         // reset the captcha after submition 
        if(_this.hasCaptcha()){
            grecaptcha.reset(_this.getCaptcha());

            // empty the captcha input 
            _this.captchaInput.val("");

        }
    }
    FormPlugin.prototype.getCaptchaID = function(){
        return this.captchaID;
    }
    FormPlugin.prototype.captchaCallback = function(response){
        // add response to input 
        _this.captchaInput.val(response);
        
        var executionResult = _this.onCaptchaValidate(response);

        if(executionResult){
            return _this.send();
        }else {
            return jQuery.noop();
        }

        // if( typeof Promise != "undefined" && executionResult instanceof Promise){
        //     return executionResult.then(function(result){
        //         if(result){
        //             // chain the send function inside the captcha response 
        //             return _this.send();
        //         }
        //     });
        // }else {
        //     if(executionResult){
        //         return _this.send();
        //     }else {
        //         // don's submit the form and do other stuff 
        //         return jQuery.noop();
        //     }
        // }
      
    };
    FormPlugin.prototype.initValidate = function(){
        this.$form.validate({
            lang: $.checkSiteRTLDirection() ? 'ar' : 'en',
            errorElement: this.options.errorElement,
            errorClass: this.options.errorClass,
            validClass: this.options.validClass,
            // focusCleanup: false, //Enables cleanup when focusing elements
            // errorLabelContainer: '.help-block',
            ignore : ".validation-ignore",
            errorPlacement: function (error, element) {
                error.appendTo(element.parents(_this.options.inputWrapper).find(_this.options.errorBlock));
                _this.showError(element);
            },
            onfocusout: function (ele) {
                if ($(ele).valid()) {
                    _this.showSuccess(ele);
                } else {
                    _this.showError(ele);
                }
            },
            onkeyup: function (ele) {
                if ($(ele).valid()) {
                    _this.showSuccess(ele);
                } else {
                    _this.showError(ele);
                }
            },
            success: function (label) {
                _this.showSuccess(label);
            },
            submitHandler: function () {
                _this.submit();
            }
        });
    };
    FormPlugin.prototype.resetForm = function(){
        _this.$form.on("reset" , function(){
            // change togglers inside the form
            _this.$form.find('[data-toggler]').prop("checked", false).change();
            // remove validation classes 
            _this.$form.find('.is-valid , .is-invalid').removeClass('is-valid').removeClass('is-invalid');
            // reset the validator
            _this.$form.data("validator").resetForm();
        });
    }
    FormPlugin.prototype.getFormData = function(){
        var formData = new FormData(), 
        allInputs = this.$form.find('[name]');

        // group the inputs by name 
        allInputs = allInputs.toArray().reduce(
            function(objectsByKeyValue, obj){
                objectsByKeyValue[obj.name] = (objectsByKeyValue[obj.name] || []).concat(obj);
                return objectsByKeyValue;
        },{});

        // append predefined input 
        allInputs["pageurl"] = [{value : location.href}];

        
        // loop the grouped collections 
        for(var name in allInputs){
            var inputCollection = allInputs[name],
            value = "";

            if(inputCollection[0] && inputCollection[0].type != "checkbox" && inputCollection[0].type != "radio"){
                // single field collection take first one only as it's not a group of checkboxes or radio
                if(inputCollection.length > 0){
                    value = inputCollection[0].value;
                }
            }else {
                // checkboxes and radio button reduce 
                var checkedInputs = inputCollection.filter(function(item){ return $(item).is(":checked") });
                if(checkedInputs.length){
                    if(inputCollection.length == 1){
                        // if it's a single checkbox then the check value is required 
                        value = $(inputCollection[0]).is(":checked");
                    }else if(inputCollection.length > 1){
                        // if it's more than one with the same name then the value is required 

                        if(inputCollection[0].type  == "radio"){
                            // radio group should be single value 
                            value = checkedInputs.find(function(input){ return $(input).is(":checked") }).value;
                        }else {
                            // checkbox group should be multiple values 
                            value = checkedInputs.map(function(input) {return input.value });
                        }
                    }
                }
            }
            // append only if it contains value
            if(!formData.get(name) && (value != undefined & value != "")) 
                formData.append(name ,value);
        }

        return formData;
    }
    FormPlugin.prototype.submit = function(){
        var captchaValidated = _this.captchaInput.val();
        if(_this.hasCaptcha() && !captchaValidated){
            // listen to captcha loaded event
            document.addEventListener("captcha-widget-loaded", function() { 
                grecaptcha.execute(_this.getCaptcha());
            });
            // load recaptcha if not loaded 
            $.dispatchEvent("load-recaptcha");
        }else {
            _this.send();
        }
    }
    FormPlugin.prototype.send = function() {
       
        if (_this.beforeSend && typeof _this.beforeSend === 'function') {
            _this.beforeSend();
        }

        try {
            var url = _this.$form.attr("action");
            $.ajax({
                processData: false,
                contentType: false,
                type: "POST",
                url: url,
				data: _this.getFormData(),
                success: function (response) {
                    if (response) {
                        _this.onSendSuccess(response);
                    } else {
                        _this.onSendError(new Error("Failed to get response"));
                    }

                    if (_this.afterSend && typeof _this.afterSend === 'function') {
                        _this.afterSend();
                    }

                    // reset captcha
                    _this.resetCaptcha();
                },
                error: function (error) {
                    if (_this.afterSend && typeof _this.afterSend === 'function') {
                        _this.afterSend();
                    }
                    _this.onSendError(error);
                    _this.resetCaptcha();
                },
            });
            if (_this.sending && typeof _this.sending === 'function') {
                _this.sending();
            }
        } catch (ex) {
            if (_this.onSendError && typeof _this.onSendError === 'function') {
                _this.onSendError(ex);
                _this.resetCaptcha();
            }
        }
    };
    // plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function(options) {
        var args = Array.prototype.slice.call(arguments, 1);

        return this.each(function() {
            var $this = $(this),
                data  = $this.data(pluginName);

            // Create a new instance.
            if (!data) {
                var newInstance = new FormPlugin(this, options);
                $this.data(pluginName, (data = newInstance));
            }

            // Make it possible to access methods from public.
            // e.g `$element.FormPlugin('method');`
            if (typeof options === 'string') {
                data[options].apply(data, args);
            }
        });
    };

    return 'Error Initializing happiness requester';

}));
