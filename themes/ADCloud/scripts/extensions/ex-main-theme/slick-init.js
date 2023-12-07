/***************************************************************************************************
Extension Name: #{$ProjectName} 
File: Slick Initialize
Owner: Wael Gomaa
Version: 1.0.0
***************************************************************************************************/
$(document).ready(function () {
  var editorMode = $(".on-page-editor").length;

  if ($.fn.slick) {
    var instances = $("[data-slick]");
    var slickEditor = true;
    instances.each(function (idx, instance) {

      slickEditor = $(instance).data("slick-editor") == undefined || $(instance).data("slick-editor");

      if (!editorMode || (slickEditor && editorMode)) {

        var rtl = $.checkSiteRTLDirection();

        // Getting items responsive count
        var childs = $(instance).hasClass("slick-initialized") ? $(instance).slick('getSlick').slideCount : $(instance).children().length,
          slidestoshow = $(instance).data("slidestoshow") || 1,
          itemslg = $(instance).data("slides-lg") || 3,
          itemsmd = $(instance).data("slides-md") || 2,
          itemssm = $(instance).data("slides-sm") || 1,
          itemsxs = $(instance).data("slides-xs") || 1;

        // Getting items responsive count
        var childsrows = $(instance).children(),
          rowstoshow = $(instance).data("rowstoshow") || 1,
          rowslg = $(instance).data("rows-lg") || rowstoshow,
          rowsmd = $(instance).data("rows-md") || rowstoshow,
          rowssm = $(instance).data("rows-sm") || rowstoshow,
          rowsxs = $(instance).data("rows-xs") || rowstoshow;


        // Arrows 
        var sliderchildarrows = $(instance).children(),
          enablearrows = $(instance).data("enablearrows") || false,
          enablearrowslg = $(instance).data("enablearrowslg") || enablearrows,
          enablearrowsmd = $(instance).data("enablearrowsmd") || enablearrows,
          enablearrowssm = $(instance).data("enablearrowssm") || enablearrows,
          enablearrowsxs = $(instance).data("enablearrowsxs") || enablearrows;

        // Dots 
        var enableDots = $(instance).data("dots") || false,
          enableDotslg = $(instance).data("dots-lg") || enableDots,
          enableDotsmd = $(instance).data("dots-md") || enableDots,
          enableDotssm = $(instance).data("dots-sm") || enableDots,
          enableDotsxs = $(instance).data("dots-xs") || enableDots;

        // infinite
        var infinite = $(instance).data().hasOwnProperty("infinite") ? $(instance).data("infinite") : true,
          infinitelg = $(instance).data("infinite-lg") || infinite,
          infinitemd = $(instance).data("infinite-md") || infinite,
          infinitesm = $(instance).data("infinite-sm") || infinite,
          infinitexs = $(instance).data("infinite-xs") || infinite;

        // initial slide
        var initialslide = $(instance).data().hasOwnProperty("initialslide") ? $(instance).data("initialslide") : 0,
          initialslidelg = $(instance).data("initialslide-lg") || initialslide,
          initialslidemd = $(instance).data("initialslide-md") || initialslide,
          initialslidesm = $(instance).data("initialslide-sm") || initialslide,
          initialslidexs = $(instance).data("initialslide-xs") || initialslide;

        // speed
        var speed = $(instance).data("speed") || 1000,
          autoplayspeed = $(instance).data("autoplayspeed") || 5000;

        // speed
        var autoplay = !!($(instance).data().hasOwnProperty("autoplay") && ($(instance).data("autoplay") != '' && !!$(instance).data("autoplay"))) && !editorMode;

        // slidesto scrolll 
        var slidesToScroll = $(instance).data("slides-to-scroll") || 1;
        // slidesToScroll = rtl ? (slidesToScroll * -1) : slidesToScroll;
       
        // height 
        var adaptiveHeight = $(instance).data("adaptive-height") || false;

        // custom arrows (updated)
        var prevArrow = $(instance).parent().find("[aria-label='prev']").length ? $(instance).parent().find("[aria-label='prev']") : "." + $(instance).data("prev-arrow"),
          nextArrow = $(instance).parent().find("[aria-label='next']").length ? $(instance).parent().find("[aria-label='next']") : "." + $(instance).data("next-arrow");

        // pause on dots hover 
        var pauseOnDotsHover = !!$(instance).data("pause-dots-hover");

        // pause on dots hover 
        var fadeEffect = $(instance).data("fade") || false;

        // Slider Syncing
        var asNavFor = $(instance).data("asnavfor");

        // focusonselect
        var focusonselect = $(instance).data("focusonselect");


        // focusonselect
        var centerPaddinglg = $(instance).data("centerpadding-lg"),
          centerPaddingmd = $(instance).data("centerpadding-md"),
          centerPaddingsm = $(instance).data("centerpadding-sm"),
          centerPaddingxs = $(instance).data("centerpadding-xs");

        //lazy loading 
        var lazyLoad = $(instance).data("lazyload");
        if (lazyLoad == 'ondemand' || lazyLoad == 'progressive') {
          $(instance).find("div[data-src]").each(function () {
            $(this).append("<div class='image'><img data-lazy='" + $(this).attr("data-src") + "'/></div>");
          });
        }

        // event listener 
        $(instance).on('init , setPosition', function (event, slick, direction) {
          var slickArrows = $(this).parents(".section").find(".slick-arrow");
          if (slickArrows.hasClass("slick-hidden")) {
            $(".slick-hidden").parent().attr('style', 'display: none !important').siblings("hr").attr('style', 'display: none !important');
          } else {
            slickArrows.parent().removeAttr('style').siblings("hr").removeAttr('style');
          }

        });
        function resizeItem(_this) {
          // update slide item height if exists 
          var items = $(_this).find('.slick-item');
          var biggestItem = items.sort(function (a, b) {
            return $(a).height() > $(b).height() ? 1 : ($(a).height() < $(b).height() ? -1 : 0);
          }).slice(-1);

          // var biggestItem = $(_this).find(".slick-track");
          var biggestItemHeight = $(biggestItem).height();
          items.css('height', biggestItemHeight + 'px');
          $(_this).find('.slick-item--maxHeight').css('maxHeight', 'calc(' + biggestItemHeight + 'px - (' + items.css("border-bottom-width") + ' + ' + items.css("border-top-width") + '))');
          $(_this).find('.slick-item--minHeight').css('minHeight', 'calc(' + biggestItemHeight + 'px - (' + items.css("border-bottom-width") + ' + ' + items.css("border-top-width") + '))');
          $(_this).find('.slick-item--height').css('height', 'calc(' + biggestItemHeight + 'px - (' + items.css("border-bottom-width") + ' + ' + items.css("border-top-width") + '))');
        }

        $(instance).on('init', function () {
          if (!$(this).find(".truncate").length) {
            resizeItem(instance);  
          }
        });

        $(window).on('truncate-done', function () {
          resizeItem(instance);  
        });
        
        $(instance).not('.slick-initialized').slick({
          dots: enableDots,
          arrows: enablearrows,
          infinite: !editorMode && infinite,
          fade: fadeEffect,
          speed: speed,
          autoplaySpeed: autoplayspeed,
          pauseOnDotsHover: pauseOnDotsHover,
          slidesToShow: slidestoshow,
          rows: rowstoshow,
          autoplay: autoplay,
          asNavFor: asNavFor,
          focusOnSelect: focusonselect,
          adaptiveHeight: adaptiveHeight,
          prevArrow: rtl ? nextArrow : prevArrow,
          nextArrow: rtl ? prevArrow : nextArrow,
          rtl: rtl,
          lazyLoad: lazyLoad,
          initialSlide: initialslide,
          responsive: [
            {
              breakpoint: 1024,
              settings: {
                slidesToShow: childs > itemslg ? itemslg : childs,
                slidesToScroll: slidesToScroll,
                infinite: !editorMode && infinitelg,
                dots: enableDotslg,
                arrows: enablearrowslg,
                rows: rowslg,
                initialSlide: initialslidelg,
                // autoplaySpeed:autoplayspeed,
                prevArrow: rtl ? nextArrow : prevArrow,
                nextArrow: rtl ? prevArrow : nextArrow,
                centerMode: !!centerPaddinglg,
                centerPadding: centerPaddinglg && (rtl ? ("0 0 " + centerPaddinglg) : (centerPaddinglg + " 0 0"))
              }
            },
            {
              breakpoint: 845,
              settings: {
                slidesToShow: childs > itemsmd ? itemsmd : childs,
                slidesToScroll: slidesToScroll,
                infinite: !editorMode && infinitemd,
                dots: enableDotsmd,
                arrows: enablearrowsmd,
                rows: rowsmd,
                initialSlide: initialslidemd,
                // autoplaySpeed:autoplayspeed,
                prevArrow: rtl ? nextArrow : prevArrow,
                nextArrow: rtl ? prevArrow : nextArrow,
                centerMode: !!centerPaddingmd,
                centerPadding: centerPaddingmd && (rtl ? ("0 0 " + centerPaddingmd) : (centerPaddingmd + " 0 0"))
              }
            },
            {
              breakpoint: 425,
              settings: {
                slidesToShow: childs > itemssm ? itemssm : childs,
                slidesToScroll: slidesToScroll,
                infinite: !editorMode && infinitesm,
                dots: enableDotssm,
                arrows: enablearrowssm,
                rows: rowssm,
                initialSlide: initialslidesm,
                // autoplaySpeed:autoplayspeed,
                prevArrow: rtl ? nextArrow : prevArrow,
                nextArrow: rtl ? prevArrow : nextArrow,
                centerMode: !!centerPaddingsm,
                centerPadding: centerPaddingsm && (rtl ? ("0 0 " + centerPaddingsm) : (centerPaddingsm + " 0 0"))
              }
            },
            {
              breakpoint: 520, // iphone 13 pro max 
              settings: {
                slidesToShow: childs > itemssm ? itemssm : childs,
                slidesToScroll: slidesToScroll,
                infinite: !editorMode && infinitesm,
                dots: enableDotssm,
                arrows: enablearrowssm,
                rows: rowssm,
                initialSlide: initialslidesm,
                // autoplaySpeed:autoplayspeed,
                prevArrow: rtl ? nextArrow : prevArrow,
                nextArrow: rtl ? prevArrow : nextArrow,
                centerMode: !!centerPaddingsm,
                centerPadding: centerPaddingsm && (rtl ? ("0 0 " + centerPaddingsm) : (centerPaddingsm + " 0 0"))
              }
            },
            {
              breakpoint: 0,
              settings: {
                slidesToShow: childs > itemsxs ? itemsxs : childs,
                slidesToScroll: slidesToScroll,
                infinite: !editorMode && infinitexs,
                dots: enableDotsxs,
                arrows: enablearrowsxs,
                rows: rowsxs,
                initialSlide: initialslidexs,
                // autoplaySpeed:autoplayspeed,
                prevArrow: rtl ? nextArrow : prevArrow,
                nextArrow: rtl ? prevArrow : nextArrow,
                centerMode: !!centerPaddingxs,
                centerPadding: centerPaddingxs && (rtl ? ("0 0 " + centerPaddingxs) : (centerPaddingxs + " 0 0"))
              }
            }
          ]
        });

      }
    });
  }


});