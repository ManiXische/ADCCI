/***************************************************************************************************
Extension Name: \\ex-sitecore-form
File: component-sitecore-form
Owner: mfouadshaheen
Version: 1.0.0
***************************************************************************************************/
$(document).ready(function () {

  // extensions 
  $.fn.clearValidation = function(){var v = $(this).validate();$('[name]',this).each(function(){v.successList.push(this);v.showErrors();});v.resetForm();$(this).trigger("reset");};


  // text area count chars 
  var countChars = function (input) {
    if ($(input).length) {
      var numberOfChars = $(input).parent().find("#maximum").text().replace(/[^\w\s]/gi, '').trim() || 200 ;
      var characterCount = $(input).val().length,
        current = $(input).parent().find("#current");
      // update the current text
      $(current).text(characterCount);
      // exceeded the limits class
      if (characterCount >= numberOfChars) {
        $(current).addClass("exceeded");
      } else {
        $(current).removeClass("exceeded");
      }
    }
  }

  $(".ex-sitecore-form textarea").keyup(function () {
    countChars($(this));
  });
  countChars($(".ex-sitecore-form textarea"));

 

  // custom togglers  
  let togglers = $('[data-toggler]');
  if (togglers.length) {
    var toggleDest = function (ele){
      let relatedElement = $(ele).data("toggler");
      let value = $(ele).is(':checked');

      if($(ele).data().hasOwnProperty("value")){
        value = $(ele).data("value") == "show";
      }

      value ? $(relatedElement).removeClass("visually-hidden ex-sitecore-form__input--hidden") : $(relatedElement).addClass("visually-hidden ex-sitecore-form__input--hidden");
    }
    togglers.each(function (idx, ele) {
      $(ele).on("change", function () {
        toggleDest(ele);
      });
      $(ele).is(':checked') && toggleDest(ele);
    });
  }
  

  // handle telphone input
  $('.ex-sitecore-form__input--tel input').on("keyup" , function() {
    var prefix = ($(this).closest(".ex-sitecore-form__input--tel").find("select").val() || "") + " ";
    if (prefix.trim() && this.value.substring(0, prefix.length) != prefix){
      $(this).val(prefix);
    }
  });

  $(".ex-sitecore-form__input--tel select").on("change", function(){
    $(this).closest(".ex-sitecore-form__input--tel").find("input").val(this.value + " ");
  });

  // enable submit button after loading 
  $(".sitecore-form , .sitecore-form form").find("[type='submit']").each(function(){
    $(this).removeClass("button--disabled")
  })


  // submit form 
  $(".sitecore-form , .sitecore-form form").on("submit" , function(e){
      let validator = $(this).data("validator");
      if(!validator || !validator.errorList || !validator.errorList.length){
        $(this).find("input[type='submit']").addClass("button--disabled");
      }
  });

  // handle idiot checkbox  
  $(".ex-sitecore-form__input__checkbox--sitecore input[type='checkbox']").each(function(idx , checkbox){
    if(checkbox.id){
      let parent = $(checkbox).parent().parent();
      $("<label for='"+ checkbox.id +"'></label>").insertAfter(checkbox);
      parent.find("> label").attr("for" , checkbox.id);
      parent.find("> .field-validation-valid").appendTo(parent);
    }
  });
  
  // handle idiot radiobutton 
  $(".ex-sitecore-form__input--radiositecore").each(function(){
    var radiobuttons  = $(".ex-sitecore-form__input__radiobox label");
    radiobuttons.on("click" , function(){
      var parent = $(this).closest(".ex-sitecore-form__input--radiositecore");
      var radioButtonValue = $(this).data("value");
        $(parent).find("input[type='radio']").each(function(){
          if($(this).val().toString().trim().toLocaleLowerCase() == radioButtonValue.toString().toLocaleLowerCase()){
            $(this).click();
          }
        });
    });
    radiobuttons.first().click();
  });


  // clear button 
  $(".sitecore-sxa-form__clear").on("click" , function(e){
    e.preventDefault();
    e.stopPropagation();
    // reseting the form 
    var form = $(this).closest("form");

    form.find(".input-file-trigger .dz-preview").remove();
    form.clearValidation();
    if(typeof grecaptcha != 'undefined'){
      grecaptcha.reset();
      $(form).find(".fxt-captcha").val("");
    }
  });


  // toggle validation 
  // manage disabling the inputs 
  $(".sitecore-form , .sitecore-form form").each(function(idx , form){
      let validator = $(this).data("validator");
      if(validator){
        let settings = $(this).data("validator").settings;
        settings && (settings.ignore = settings.ignore + " , .validation-ignore");

        function controlToggler(toggler){
          let container = $(toggler).data("validation-toggle");
          let inputs = $(container).find(".input-field");

          // // append N/A option to select 
          // $(container).find("select").each(function(idx , select){
          //   let dumyOption = "<option value='N/A'></option>";
          //   if($(select).children().length){
          //     let firstChild = $(select).children()[0];
          //     if(firstChild && !$(firstChild).text().trim() && !$(firstChild).val().trim() ){
          //       $(firstChild).val("N/A");
          //     }else {
          //       $(firstChild).val() != "N/A" && $(this).prepend(dumyOption);
          //     }
          //   }else {
          //     $(this).append(dumyOption);
          //   }
          // });

          if($(toggler).data("value") == "show"){
            // remove ignore 
            inputs.removeClass("validation-ignore");
          }else {
            // add ignore 
            inputs.addClass("validation-ignore").removeClass("input-validation-error");
            inputs.siblings(".field-validation-error").empty();
            // inputs.val("N/A");
          }
          // clear the inputs
          inputs.val("");

          // reset custom drop downs 
          // $(container).find(".custom-dropdown").removeClass("custom-dropdown-hasvalue").text("");
        }

        let togglers = $(this).find("[data-validation-toggle]");
        togglers.on("change" , function(){
            controlToggler(this);
        });
        
        let checkedTogglers = $(this).find("[data-validation-toggle]:checked");
        checkedTogglers.each(function(idx , toggler){
          controlToggler(toggler);
        });
      }
  });


  // hide validation summary, if empty 
  var validationText = $(".validation-summary-errors").text().trim();
  if(!validationText){
    $(".validation-summary-errors").remove();
  }
  
});
