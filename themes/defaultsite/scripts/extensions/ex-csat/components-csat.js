/***************************************************************************************************
Extension Name: \\ex-csat
File: component-csat
Owner: ahmedalaaezzt
Version: 1.0.0
***************************************************************************************************/
$(document).ready(function () {
  var rtl = $('html[lang="ar-AE"]').length;
  var feedback = new GlobalCsatFeedbackJS({
    onSubmit: function (a, b) {
      console.log(a, b);
      try {
        $.post("/searchresults/pub/adfeedback/feedbacks", {
          surveyType: "general",
          smileyType: a,
          comments: b.comment,
          ratings: {
            ease: b.ease,
            quality: b.quality,
            performance: b.performance,
          },
          pageUrl: window.location.href,
        }).done(function (data) {
          console.log(data);
        });
      } catch (e) {
        console.log(e);
      }
    },
    locale: $("html").attr("lang") == "ar-AE" ? "ar" : "en",
  });
  feedback.init();


  /* #feedbackHolder div works as temp container for the HTML that should be inserted inside the feedback button 
    once the button container created by the third party plugin the code will move the feedback elements to the feedback button
  */
  var checkExist = setInterval(function () {
    if (
      $(".ui-lib-global-csat-feedback-js-open-button.ui-lib-global-csat-feedback-js-open-button_default").length
    ) {
      $(".ui-lib-global-csat-feedback-js-open-button.ui-lib-global-csat-feedback-js-open-button_default")[0].innerHTML = $("#feedbackHolder")[0].innerHTML;
      clearInterval(checkExist);
    }
  }, 100); // check every 100ms

  //code of the html inside the varient
  // /sitecore/content/DED/DED V2/Data/Plain HTML/CSAT
  /* <div id="feedbackHolder" style="display: none;">
  <div class='open-button-elements-container d-flex'>
  <svg data-id='positive' width='140' height='140' viewBox='0 0 140 140' xmlns='http://www.w3.org/2000/svg' style='width: 29px;height: 48px; margin:0px 11px'>
  <path data-id='positive' class='ui-lib-global-csat-feedback-js-form__emotions-button_default' d='M70 0a70 70 0 100 140A70 70 0 0070 0zm19 42a9 9 0 110 19 9 9 0 010-19zm-38 0a9 9 0 110 19 9 9 0 010-19zm55 49a42 42 0 01-72 0 5 5 0 118-5 33 33 0 0056 0 5 5 0 118 5z' fill='#faa317' fill-rule='evenodd' style='fill: white;'>
  </path>
  </svg>
  <div class='open-button-feedback-label'>Feedback</div>
  </div>
  </div> */
});
