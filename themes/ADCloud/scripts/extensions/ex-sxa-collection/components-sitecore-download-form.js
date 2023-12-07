/***************************************************************************************************
Extension Name: \\ex-sitecore-form
File: component-sitecore-form
Owner: saadansari
Version: 1.0.0
***************************************************************************************************/

$(document).ready(function () {
  $.checkSiteRTLDirection = function () {};

  let baseClass = ".ex-download-form",
    form = $(baseClass).find("form"),
    submitBtn = form.find('[type="submit"]'),
    inputWrapper = ".ex-sitecore-form__input",
    response = null;

  function validateInput() {
    if (form.valid() && response) {
      submitBtn.prop("disabled", false);
    } else {
      submitBtn.prop("disabled", "disabled");
    }
  }

  function showError() {
    // remove the loader
    submitBtn.addClass("button--loader");
  }
  // init form requester
  let formPlugin = form
    .FormPlugin({
      errorBlock: ".field-validation-error",
      errorClass: "input-validation-error",
      inputWrapper: inputWrapper,
      captchaWrapper: ".captcha-wrapper",

      onInit: function () {
        $(inputWrapper).on("blur keyup", function () {
          validateInput();
        });
      },
      beforeSend: function () {
        // the logic you want to execute before send
      },
      onCaptchaValidate: function (res) {
        // When the captcha inside the form validated it will execute this
        // returning promise for the future implementation
        response = res;
        validateInput();
        return false;

        return new Promise(function (resolve, reject) {
          if (response) {
            resolve(!!response);
          } else {
            showError();
            reject(false);
          }
        });
      },
      onSendSuccess: function (response) {

        $("#submit").click(function (e) {
          var dataSource = $("#submit").attr("data-ds");
          var currentPageInfo = $("#submit").attr("data-currentPage");
          var userName = $("#name").val();
          var userEmail = $("#email").val();
          var emailData = {
            name: $("#name").val(),
            email: $("#email").val()
          };

          $.ajax({
            type: "GET",
            url: "/api/DownloadForm/DownloadFormData", //"DownloadForm/DownloadFormData",//"api/sitecore/DownloadForm/DownloadFormLink",
            data: {
              userName: userName,
              userEmail: userEmail,
              ds: dataSource,
              currentPage: currentPageInfo
            }, // ds: "abc", currentPage:"test"},//{data: dataString, ds:@datasource, currentPage:@currentPage},
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
              console.log("OnClickSuccess");
              console.log(response);
              if (response == true) {
                $("#downloadButtonSection").show();
                $("#downloadForm").hide();
              } else {
                $("#downloadButtonSection").hide();
                $("#downloadForm").show();
              }
            },
            error: function () {

              alert('error');
            }
          });





        });
        // the logic you want to on success
        if (response && response.status) {
          // collpase the form

          // remove the loader
          submitBtn.addClass("button--loader");

          // reset form
          // $(form).trigger("reset");

          $(form).remove();
        } else {
          showError();
          // throw Error(response ? response.reason : "Response is wrong");
        }
      },
      onSendError: function (err) {
        // the logic you want to on error
        console.log(err);
        showError();
      },
    })
    .data("FormPlugin");
});