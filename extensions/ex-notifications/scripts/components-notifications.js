/***************************************************************************************************
Extension Name: \\ex-notifications
File: component-notifications
Owner: tawfik
Version: 1.0.0
***************************************************************************************************/

$(document).ready(function () {
    let notificationWrapper = '.ex-notifications',
    slickCssClass = '.slick-notification', 
    rtl = $.checkSiteRTLDirection();

    $(".news-notify-item > p").hover(function (e) {
        animateText(e, this)
    });

    $(".hover-item").hover(function (e) {
        animateText(e, this)
    });

    function animateText(event, target){
        if (event.type == "mouseenter") {
            runanimatenotification($(target))
        } else {
            stopanimatenotification($(target))
        }
    }

    $(slickCssClass).on('afterChange', function (event, slick, currentSlide, nextSlide) {
        $('.slick-notification').slick('slickPause');
        stopanimatenotification($(".slick-notification .news-notify-item>p"))
        /*setTimeout(function () {
  let notificationWrapper = ".ex-notifications",
    slickCssClass = ".slick-notification",
    rtl = $.checkSiteRTLDirection();

  if (!$("body").hasClass("on-page-editor")) {
    $(notificationWrapper)
      .find(".announcement-content")
      .hover(function (e) {
        // console.log("hover");
        let $this = $(this).find(".slick-active .news-notify-item > p");
        if (e.type == "mouseenter") {
          // console.log("enter");
          runanimatenotification($this);
        } else {
          // console.log("leave");
          stopanimatenotification($this);
        }
      });
  }

  // $(".on-page-editor .news-notify-item > p").click(function (e) {
  //   if (e.type == "click") {
  //     stopanimatenotification($(this));
  //   } else {
  //     runanimatenotification($(this));
  //   }
  // });

  $(slickCssClass).on("afterChange", function (
    event,
    slick,
    currentSlide,
    nextSlide
  ) {
    $(".slick-notification").slick("slickPause");
    stopanimatenotification($(".slick-notification .news-notify-item>p"));
    /*setTimeout(function () {
            runanimatenotification($(".slick-notification .slick-active .news-notify-item>p"))
        }, 1000);*/
  });

  if ($(".news-notify-item").length < 2) {
    $(".ex-notifications").find(".custom-circle").hide();
  }

  //Hide Annoucemnet component in case no annoucements
  let notificationsSlick =
    $(slickCssClass).slick && $(slickCssClass).slick("getSlick");
  if (
    !notificationsSlick ||
    !notificationsSlick.$slides ||
    !notificationsSlick.$slides.length
  ) {
    $(notificationWrapper).hide();
  }

  var dir =  $.checkSiteRTLDirection() ? 'rtl':'ltr'
    $('#newsTicker1').breakingNews({
      effect: 'slide-left',
      direction: dir
    });
});

function runanimatenotification(x) {
  var rtl = $.checkSiteRTLDirection();

  $(x).stop();
  // console.log($(x).width());
  // console.log($(x).parent().width());
  if ($(x).width() > $(x).parent().parent().width()) {
    var cwidthmove = -($(x).width() - $(x).parent().width() + 50);
    var cwidthtime = $(x).width() * 12;
    let options = {
      left: cwidthmove,
    };
    if (rtl) {
      options = {
        right: cwidthmove,
      };
    }

    $(x).animate(options, cwidthtime, "linear", function () {
      // Animation complete.
      // console.log("completed");
      // $(".slick-notification").slick("slickPlay");
      $(".slick-notification").slick("slickNext");
    });
  } else {
    // $(".slick-notification").slick("slickPlay");
  }
}

function stopanimatenotification(x) {
  var rtl = $.checkSiteRTLDirection();
  var cwidthmove = -($(x).width() - $(x).parent().width() + 50);

  let options = {
    left: 0,
  };
  if (rtl) {
    options = {
      right: 0,
    };
  }

  $(x).stop();

  $(x).animate(options, 500, function () {
    // Animation complete.
    $(".slick-notification").slick("slickPlay");
  });
}
