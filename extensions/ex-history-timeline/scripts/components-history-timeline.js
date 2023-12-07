/***************************************************************************************************
Extension Name: \\ex-history-timeline
File: component-history-timeline
Owner: Nigel Marshal
Version: 1.0.0
***************************************************************************************************/
$(document).ready(function() {
  if($(".ex-history-timeline").length){
    // position the nav
    $(".ex-history-timeline__nav").css({"top" : $(".ex-history-timeline").offset().top + "px"});

    $(window).scroll(function(){
      var windowScroll = $(window).scrollTop(), 
      historyElementTopOffset = $(".ex-history-timeline").offset().top,
      historyOuterHeight = $(".ex-history-timeline").outerHeight();

      if(windowScroll > historyElementTopOffset){
        // the element out from view 
        $(".ex-history-timeline__nav").css({"top" : "145px"});
      }else {
        $(".ex-history-timeline__nav").css({"top" : $(".ex-history-timeline").offset().top + "px"});
      }
    });
    
    $(".ex-history-timeline__year").on("click", function(event) {
      event.preventDefault();
      var timelineYear = this.closest(".ex-history-timeline__journey");
      $("html, body").animate(
        {
          scrollTop: $(timelineYear).offset().top
        },
        800
      );
    });

    var sectionPosition = [];
    $(".ex-history-timeline__journey").each(function() {
      sectionPosition.push($(this).offset().top);
    });

    $(".ex-history-timeline__nav-point").click(function() {
      var element = document.getElementById($.attr(this, "href").replace("#" ,""));
      $("html, body").animate(
        {
          scrollTop: $(element).offset().top - 130
        },
        500
      );
      return false;
    });

    $(".ex-history-timeline__nav ul li a").click(function() {
      $(".ex-history-timeline__nav ul li a").removeClass("active");
      $(this).addClass("active");
    });

    $(document).scroll(function() {
      var position = $(document).scrollTop(),
        index;
      for (var i = 0; i < sectionPosition.length; i++) {
        if (position <= sectionPosition[i]) {
          index = i;
          break;
        }
      }
      $(".ex-history-timeline__nav ul li a").removeClass("active");
      if(index != undefined){
        $(".ex-history-timeline__nav").removeClass("ex-history-timeline__nav--hidden");
        $(".ex-history-timeline__nav ul li a:eq(" + index + ")").addClass("active");
      }else {
        $(".ex-history-timeline__nav").addClass('ex-history-timeline__nav--hidden');
      }
    });

    $(".ex-history-timeline__nav ul li a").click(function() {
      $(".ex-history-timeline__nav ul li a").removeClass("active");
      $(this).addClass("active");
    });
        
  }
});
