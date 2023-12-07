/* eslint-disable camelcase */
//OTP auto tab
if ($(".otp__form__inputs").length) {
  $(".otp__form__inputs__code").keyup(function () {
    var key = event.keyCode || event.charCode;
    if (key == 8 || key == 46) {
      $(this).prev(".otp__form__inputs__code").select();
    }
    if (this.value.length == this.maxLength) {
      var $next = $(this).next(".otp__form__inputs__code");
      if ($next.length) $(this).next(".otp__form__inputs__code").select();
      else $(this).blur();
    }
  });
}

//OTP Copy and past
var $inputs = $(".otp__form__inputs__code");

$inputs.on("paste", function () {
  $(".otp__form .button").removeAttr("disabled");
  //define variables to use it many times for each input same as defining the $inputs above
  var $this = $(this);
  var originalValue = $this.val();

  $this.one("input.fromPaste", function () {
    $BoxInput = $(this);
    var pastedNumbers = $BoxInput.val();

    if (pastedNumbers.length == 6) {
      pasteValues(pastedNumbers);
    } else {
      $this.val(originalValue);
    }
  });

  $inputs.attr("maxlength", 6);
});

function pasteValues(numbers) {
  //this function recieve the pasted numbers and split them
  var values = numbers.split("");
  //for each of the splitted number we will add the number to the input box and using the index will add one number
  //and go to the next to run again using the .one function used ubove
  $(values).each(function (index) {
    //using index +1 so every time a number is copied after the split it will take the number after the pasted number
    var $inputBox = $(
      '.otp__form__inputs__code[for="otp_number[' + (index + 1) + ']"]'
    );
    $inputBox.val(values[index]);
  });
}

//OTP button disable enable
$(".otp__form__inputs input.otp__form__inputs__code:eq(5)").focus(function () {
  if ($(this).prevAll("input.otp__form__inputs__code").val().length == 0) {
    alert(otpAlertMsg);
  } else {
    $("button").removeAttr("disabled");
  }
});
//OTP validation
$(function () {
  var ADCloud_OTP_FillAllFields;
  var ADCloud_OTP_NonNumericData;
  $("form[name='submit_otp']").validate({
    rules: {
      otp_number1: {
        required: true,
        number: true,
        min: 0,
        max: 9,
      },
      otp_number2: {
        required: true,
        number: true,
        min: 0,
        max: 9,
      },
      otp_number3: {
        required: true,
        number: true,
        min: 0,
        max: 9,
      },
      otp_number4: {
        required: true,
        number: true,
        min: 0,
        max: 9,
      },
      otp_number5: {
        required: true,
        number: true,
        min: 0,
        max: 9,
      },
      otp_number6: {
        required: true,
        number: true,
        min: 0,
        max: 9,
      },
    },
    messages: {
      otp_number1: {
        required: ADCloud_OTP_FillAllFields,
        number: ADCloud_OTP_NonNumericData,
        min: ADCloud_OTP_NonNumericData,
        max: ADCloud_OTP_NonNumericData,
      },
      otp_number2: {
        required: ADCloud_OTP_FillAllFields,
        number: ADCloud_OTP_NonNumericData,
        min: ADCloud_OTP_NonNumericData,
        max: ADCloud_OTP_NonNumericData,
      },
      otp_number3: {
        required: ADCloud_OTP_FillAllFields,
        number: ADCloud_OTP_NonNumericData,
        min: ADCloud_OTP_NonNumericData,
        max: ADCloud_OTP_NonNumericData,
      },
      otp_number4: {
        required: ADCloud_OTP_FillAllFields,
        number: ADCloud_OTP_NonNumericData,
        min: ADCloud_OTP_NonNumericData,
        max: ADCloud_OTP_NonNumericData,
      },
      otp_number5: {
        required: ADCloud_OTP_FillAllFields,
        number: ADCloud_OTP_NonNumericData,
        min: ADCloud_OTP_NonNumericData,
        max: ADCloud_OTP_NonNumericData,
      },
      otp_number6: {
        required: ADCloud_OTP_FillAllFields,
        number: ADCloud_OTP_NonNumericData,
        min: ADCloud_OTP_NonNumericData,
        max: ADCloud_OTP_NonNumericData,
      },
    },
    groups: {
      otpNumbers:
        "otp_number1 otp_number2 otp_number3 otp_number4 otp_number5 otp_number6",
    },
    errorElement: "div",
    errorLabelContainer: ".otp__form__inputs__error",
  });

  // open Setting & Login side menu
  $("[data-settings]").on("click", function () {
    var val = $(this).data("settings");
    if (val == "login") {
      $(".setting-section-wrap")
        .closest(".settings-wrp")
        .removeClass("settings-wrp--active");
      $(".setting-section-wrap").closest(".settings-wrp").hide();
    } else {
      $(".login-section-wrap")
        .closest(".settings-wrp")
        .removeClass("settings-wrp--active");
      $(".login-section-wrap").closest(".settings-wrp").hide();
    }
  });

  // Email Specific valid domain validation
  function validatorDomainCheck() {
    var domains = document.getElementById("hdn_domains").value.split(",");
    var emailAddressVal = $(".EmailValidDomain").val().split("@");
    var valid = false;
    if (domains.indexOf(emailAddressVal[0]) > -1) {
      valid = true;
    }
    if (domains.indexOf(emailAddressVal[1]) > -1) {
      valid = true;
    }
    if (valid) {
      $(".domain-specific-validation").addClass("d-none");
      return true;
    } else {
      $(".domain-specific-validation").removeClass("d-none");
      $(".EmailValidDomain").removeClass("valid");
      return false;
    }
  }

  // Email Specific valid exist check & form submit
  if ($(".EmailValidDomain").length) {
    $("form").submit(function (event) {
      if ($(this).valid()) {
        return validatorDomainCheck();
      }
    });
  }
  // Email Specific valid input validation check
  $("form input.EmailValidDomain").on("blur", function (event) {
    if ($(this).valid()) {
      validatorDomainCheck();
    }
  });
});
