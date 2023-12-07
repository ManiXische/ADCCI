/***************************************************************************************************
Extension Name: \\ex-inner-header
File: component-inner-header
Owner: Shaheen
Version: 2.0.0
***************************************************************************************************/

$(document).ready(function () {
  var rtl = $.checkSiteRTLDirection();
  var list = $(".page-breadcrumb-v2 ol");
  var listOfLinks = list.find("a");
  var $contaniner = $("<div class='bredcrumb-dropdown position-absolute mt-1'/>");

  function createContainer(){
    var $select = $(
      "<div class='dropdown-menu' />"
    );

    $contaniner.empty();
    $contaniner.append($select);

    return $select;
  }
  replaceOlwithDD();

  $(window).resize(function () {
    replaceOlwithDD();
  });

  function replaceOlwithDD() {
    $(".page-breadcrumb-v2 .bredcrumb-dropdown").replaceWith(list);
    var toggleDots = $(".breadcrumb-toggler--dots");
    if ($(window).width() < 767) {
      $select = createContainer();
  
      listOfLinks.each(function () {
        if ($(this)[0]!== listOfLinks.last()[0]) {
          var $option = $("<a />");
          $option.attr("href", $(this).attr("href")).html($(this).html());
          $option.attr("class", "dropdown-item");
          $select.append($option);
          $select.append($("<div class='dropdown-divider'></div>"));
        }
      });
      toggleDots.remove();
      $contaniner.removeClass("position-absolute");
      $(list).replaceWith($contaniner);

    }else if($(window).width() < 992 && listOfLinks.length > 4){
      $select = createContainer();
      
      toggleDots.addClass("d-md-inline-block");

      for(var i = 1 ; i < listOfLinks.length - 2 ; i++){
        var _this = listOfLinks[i];
        var $option = $("<a />");
        $option.attr("href", $(_this).attr("href")).html($(_this).html());
        $option.attr("class", "dropdown-item");
        $select.append($option);
        $select.append($("<div class='dropdown-divider'></div>"));
        $(_this).parents("li").remove();
      }
      
      toggleDots.insertAfter($(list).children().first());
      // $($contaniner).insertAfter($(list)).css({"left" : "auto"});
      rtl ? $contaniner.css({"right" : "-35px"}) : $contaniner.css({"left" : "-35px"});
      toggleDots.append($contaniner);
    } 
    else {
      toggleDots.removeClass("d-md-inline-block");
      if ($(".page-breadcrumb-v2 .bredcrumb-dropdown").length > 0)
        $(".page-breadcrumb-v2 .bredcrumb-dropdown").replaceWith(list);
    }
  }

  //to close the dropdown menu on clicking outside of it
  $(document).mouseup(function (e) {
    var container = $(".dropdown-menu");
    if(container.hasClass("show"))
      if (!container.is(e.target) && container.has(e.target).length === 0  & !$(e.target).hasClass("breadcrumb-toggler")) {
        $(".dropdown-menu").toggleClass("show");
      }
  });

    //opens dropdown menu
    $(".breadcrumb-toggler").on("click", function () {
      $(".dropdown-menu").toggleClass("show");
    });
});
