/***************************************************************************************************
Extension Name: \\ex-publications-v2
File: component-ex-publications-v2
Owner: ahmedalaaezzt
Version: 1.0.0
***************************************************************************************************/



$("document").ready(function () {
  $(".ex-publications-v2-card--dropdown").click(function (e) {
    if ($(this).hasClass("active")) {
      $(".ex-publications-v2-card--dropdown").removeClass("active");
      $(".ex-publications-v2-card--dropdown--list").slideUp(100);
    } else {
      $(".ex-publications-v2-card--dropdown").removeClass("active");
      $(".ex-publications-v2-card--dropdown--list").slideUp(100);
      $(this).addClass("active");
      $(".active .ex-publications-v2-card--dropdown--list").slideDown(100);
    }
  });

  $(document).on("click", function (e) {
    if (
      $(e.target).parents(".ex-publications-v2-card--dropdown").length === 0
    ) {
      $(".ex-publications-v2-card--dropdown--list").slideUp(100);
      $(".ex-publications-v2-card--dropdown").removeClass("active");
    }
  });
});
