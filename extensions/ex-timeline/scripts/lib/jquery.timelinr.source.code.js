/* ----------------------------------
jQuery Timelinr 0.9.7
tested with jQuery v1.6+

Copyright 2011, CSSLab.cl
Free under the MIT license.
http://www.opensource.org/licenses/mit-license.php

instructions: http://www.csslab.cl/2011/08/18/jquery-timelinr/
---------------------------------- */

jQuery.fn.timelinr = function(options){
  // default plugin settings
  settings = jQuery.extend({
    orientation:              'horizontal', // value: horizontal | vertical, default to horizontal
    containerDiv:             '#timeline',  // value: any HTML tag or #id, default to #timeline
    navigatorsDiv:            '#timeline #navigators',     // value: any HTML tag or #id, default to #navigators
    navigatorsSelectedClass:  'selected',   // value: any class, default to selected
    navigatorsPreviousClass:  'previous',   // value: any class, default to previous
    navigatorsSpeed:          'normal',     // value: integer between 100 and 1000 (recommended) or 'slow', 'normal' or 'fast'; default to normal
    contentsDiv:              '#timeline #contents',    // value: any HTML tag or #id, default to #contents
    imageWrapperContainer:    '#timeline #images',    // value: any HTML tag or #id, default to #images
    contentsSelectedClass:    'selected',   // value: any class, default to selected
    contentsSpeed:            'fast',       // value: integer between 100 and 1000 (recommended) or 'slow', 'normal' or 'fast'; default to fast
    contentsTransparency:     0.2,          // value: integer between 0 and 1 (recommended), default to 0.2
    contentsTransparencySpeed:500,          // value: integer between 100 and 1000 (recommended), default to 500 (normal)
    prevButton:               '#timeline #prev',      // value: any HTML tag or #id, default to #prev
    nextButton:               '#timeline #next',      // value: any HTML tag or #id, default to #next
    disabledButtonClass:      'disabled',      // value: any class, default to previous
    arrowKeys:                false,      // value: true | false, default to false
    startAt:                  1,            // value: integer, default to 1 (first)
    autoPlay:                 false,      // value: true | false, default to false
    autoPlayDirection:        'forward',    // value: forward | backward, default to forward
    autoPlayPause:            2000          // value: integer (1000 = 1 seg), default to 2000 (2segs)
  }, options);

  $(function(){
    var isTablet =  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    // Checks if required elements exist on page before initializing timelinr | improvement since 0.9.55
    if ($(settings.navigatorsDiv).length > 0 && $(settings.contentsDiv).length > 0) {
      // setting variables... many of them
      var howManyNavigators = $(settings.navigatorsDiv+' li').length;
      var howManyContents = $(settings.contentsDiv+' li').length;
      var currentDate = $(settings.navigatorsDiv).find('li.'+settings.navigatorsSelectedClass);
      var currentIssue = $(settings.contentsDiv).find('li.'+settings.contentsSelectedClass);
      var widthContainer = $(settings.containerDiv).width();
      var heightContainer = $(settings.containerDiv).height();
      var widthContents = $(settings.contentsDiv).width();
      var heightContents = $(settings.contentsDiv).height();
      var widthIssue = $(settings.contentsDiv+' li').width();
      var heightIssue = $(settings.contentsDiv+' li').height();
      var widthNavigators = $(settings.navigatorsDiv).width();
      var heightNavigators = $(settings.navigatorsDiv).outerHeight();
      var widthDate = $(settings.navigatorsDiv+' li').width();
      var heightDate = $(settings.navigatorsDiv+' li').outerHeight();
      var numberOfNavigatorsInView = parseInt(heightContainer / heightDate);

      // set positions!
      if(settings.orientation == 'horizontal') {
        $(settings.contentsDiv).width(widthIssue*howManyContents);
        $(settings.navigatorsDiv).width(widthDate*howManyNavigators).css('marginLeft',widthContainer/2-widthDate/2);
        var defaultPositionNavigators = parseInt($(settings.navigatorsDiv).css('marginLeft').substring(0,$(settings.navigatorsDiv).css('marginLeft').indexOf('px')));
      } else if(settings.orientation == 'vertical') {
        $(settings.contentsDiv).height(heightIssue*howManyContents);
        $(settings.navigatorsDiv).height(heightDate*howManyNavigators)
        // .css('marginTop',heightContainer/2-heightDate/2);
        var defaultPositionNavigators = parseInt($(settings.navigatorsDiv).css('marginTop').substring(0,$(settings.navigatorsDiv).css('marginTop').indexOf('px')));
      }

      $(settings.navigatorsDiv+' li').click(function(event){
        event.preventDefault();
        // first vars
        var whichIssue = $(this).text();
        var currentIndex = $(this).prevAll().length;
        // moving the elements
        if(settings.orientation == 'horizontal') {
          $(settings.contentsDiv).animate({'marginLeft':-widthIssue*currentIndex},{queue:false, duration:settings.contentsSpeed});
        } else if(settings.orientation == 'vertical') {
          $(settings.contentsDiv).animate({'marginTop':-heightIssue*currentIndex},{queue:false, duration:settings.contentsSpeed});
        }
        $(settings.contentsDiv+' li').animate({'opacity':settings.contentsTransparency},{queue:false, duration:settings.contentsSpeed}).removeClass(settings.contentsSelectedClass).eq(currentIndex).addClass(settings.contentsSelectedClass).fadeTo(settings.contentsTransparencySpeed,1);
        
        // animate image container with the selected background image
        if(settings.imageWrapperContainer && $(settings.imageWrapperContainer).attr("data-index") != currentIndex){
            var imageWrapper = $(settings.imageWrapperContainer);
            // adding current index 
            imageWrapper.attr("data-index", currentIndex);

            // fadein the current item image into the container and fadeout the others 
            if(isTablet){
              imageWrapper.children("div").hide();
            }
            else {
              imageWrapper.children("div").fadeOut("slow");
            }
            var currentItem = imageWrapper.children("div").eq(currentIndex).css("background-image" , 'url(' +$(settings.contentsDiv+' li').eq(currentIndex).data("image")+ ')');
            
            if(isTablet){
              currentItem.show();
            }else {
              currentItem.fadeIn("slow");
            }

            // load the next one just in case 
            imageWrapper.children("div").eq(currentIndex + 1).css("background-image" , 'url(' +$(settings.contentsDiv+' li').eq(currentIndex).data("image")+ ')');
        }
        // prev/next buttons now disappears on first/last issue | bugfix from 0.9.51: lower than 1 issue hide the arrows | bugfixed: arrows not showing when jumping from first to last navigator
        if(howManyNavigators == 1) {
          $(settings.prevButton+','+settings.nextButton).addClass(settings.disabledButtonClass);
        } else if(howManyNavigators == 2) {
          if($(settings.contentsDiv+' li:first-child').hasClass(settings.contentsSelectedClass)) {
            $(settings.prevButton).addClass(settings.disabledButtonClass);
            $(settings.nextButton).removeClass(settings.disabledButtonClass);
          }
          else if($(settings.contentsDiv+' li:last-child').hasClass(settings.contentsSelectedClass)) {
            $(settings.nextButton).addClass(settings.disabledButtonClass);
            $(settings.prevButton).removeClass(settings.disabledButtonClass);
          }
        } else {
          if( $(settings.contentsDiv+' li:first-child').hasClass(settings.contentsSelectedClass) ) {
            $(settings.nextButton).removeClass(settings.disabledButtonClass);
            $(settings.prevButton).addClass(settings.disabledButtonClass);
          }
          else if( $(settings.contentsDiv+' li:last-child').hasClass(settings.contentsSelectedClass) ) {
            $(settings.prevButton).removeClass(settings.disabledButtonClass);
            $(settings.nextButton).addClass(settings.disabledButtonClass);
          }
          else {
            $(settings.nextButton+','+settings.prevButton).removeClass(settings.disabledButtonClass);
          }
        }
        // now moving the navigators
        $(settings.navigatorsDiv+ ' li').removeClass(settings.navigatorsSelectedClass).removeClass(settings.navigatorsPreviousClass);
        $(this).prevAll().addClass(settings.navigatorsPreviousClass);
        $(this).removeClass().addClass(settings.navigatorsSelectedClass);


        if(settings.orientation == 'horizontal') {
          $(settings.navigatorsDiv).animate({'marginLeft':defaultPositionNavigators-(widthDate*currentIndex)},{queue:false, duration:'settings.navigatorsSpeed'});
        } else if(settings.orientation == 'vertical') {
          let NavigatorsInViewLimit = parseInt((numberOfNavigatorsInView + 1) / 2) ;
          let marginTop = defaultPositionNavigators -(heightDate* (currentIndex - NavigatorsInViewLimit));

          // if the limit is not exceeded yet
          if(currentIndex <= NavigatorsInViewLimit){
            marginTop = 0;
          }
          // stop navigation only if the limit at the end
          if((howManyNavigators - currentIndex) >= NavigatorsInViewLimit){
            $(settings.navigatorsDiv).animate({'marginTop': marginTop},{queue:false, duration:'settings.navigatorsSpeed'});
          }
        }
      });

      if(settings.arrowKeys) {
        // show buttons
        $(settings.nextButton).fadeIn();
        $(settings.prevButton).fadeIn();

        $(settings.nextButton).bind('click', function(event){
          event.preventDefault();
          // bugixed from 0.9.54: now the navigators gets centered when there's too much navigators.
          var currentIndex = $(settings.contentsDiv).find('li.'+settings.contentsSelectedClass).index();
          if(settings.orientation == 'horizontal') {
            var currentPositionContents = parseInt($(settings.contentsDiv).css('marginLeft').substring(0,$(settings.contentsDiv).css('marginLeft').indexOf('px')));
            var currentIssueIndex = currentPositionContents/widthIssue;
            var currentPositionNavigators = parseInt($(settings.navigatorsDiv).css('marginLeft').substring(0,$(settings.navigatorsDiv).css('marginLeft').indexOf('px')));
            var currentIssueDate = currentPositionNavigators-widthDate;
            if(currentPositionContents <= -(widthIssue*howManyContents-(widthIssue))) {
              $(settings.contentsDiv).stop();
              $(settings.navigatorsDiv+' li:last-child').click();
            } else {
              if (!$(settings.contentsDiv).is(':animated')) {
                // bugixed from 0.9.52: now the navigators gets centered when there's too much navigators.
                $(settings.navigatorsDiv+' li').eq(currentIndex+1).trigger('click');
              }
            }
          } else if(settings.orientation == 'vertical') {
            var currentPositionContents = parseInt($(settings.contentsDiv).css('marginTop').substring(0,$(settings.contentsDiv).css('marginTop').indexOf('px')));
            var currentIssueIndex = currentPositionContents/heightIssue;
            var currentPositionNavigators = parseInt($(settings.navigatorsDiv).css('marginTop').substring(0,$(settings.navigatorsDiv).css('marginTop').indexOf('px')));
            var currentIssueDate = currentPositionNavigators-heightDate;
            if(currentPositionContents <= -(heightIssue*howManyContents-(heightIssue))) {
              $(settings.contentsDiv).stop();
              $(settings.navigatorsDiv+' li:last-child').click();
            } else {
              if (!$(settings.contentsDiv).is(':animated')) {
                // bugixed from 0.9.54: now the navigators gets centered when there's too much navigators.
                $(settings.navigatorsDiv+' li').eq(currentIndex+1).trigger('click');
              }
            }
          }
          // prev/next buttons now disappears on first/last issue | bugfix from 0.9.51: lower than 1 issue hide the arrows
          if(howManyNavigators == 1) {
            $(settings.prevButton+','+settings.nextButton).addClass(settings.disabledButtonClass);
          } else if(howManyNavigators == 2) {
            if($(settings.contentsDiv+' li:first-child').hasClass(settings.contentsSelectedClass)) {
              $(settings.prevButton).addClass(settings.disabledButtonClass);
              $(settings.nextButton).removeClass(settings.disabledButtonClass);
            }
            else if($(settings.contentsDiv+' li:last-child').hasClass(settings.contentsSelectedClass)) {
              $(settings.nextButton).addClass(settings.disabledButtonClass);
              $(settings.prevButton).removeClass(settings.disabledButtonClass);
            }
          } else {
            if( $(settings.contentsDiv+' li:first-child').hasClass(settings.contentsSelectedClass) ) {
              $(settings.prevButton).addClass(settings.disabledButtonClass);
            }
            else if( $(settings.contentsDiv+' li:last-child').hasClass(settings.contentsSelectedClass) ) {
              $(settings.nextButton).addClass(settings.disabledButtonClass);
            }
            else {
              $(settings.nextButton+','+settings.prevButton).removeClass(settings.disabledButtonClass);
            }
          }
        });
        $(settings.prevButton).click(function(event){
          event.preventDefault();
          // bugixed from 0.9.54: now the navigators gets centered when there's too much navigators.
          var currentIndex = $(settings.contentsDiv).find('li.'+settings.contentsSelectedClass).index();
          if(settings.orientation == 'horizontal') {
            var currentPositionContents = parseInt($(settings.contentsDiv).css('marginLeft').substring(0,$(settings.contentsDiv).css('marginLeft').indexOf('px')));
            var currentIssueIndex = currentPositionContents/widthIssue;
            var currentPositionNavigators = parseInt($(settings.navigatorsDiv).css('marginLeft').substring(0,$(settings.navigatorsDiv).css('marginLeft').indexOf('px')));
            var currentIssueDate = currentPositionNavigators+widthDate;
            if(currentPositionContents >= 0) {
              $(settings.contentsDiv).stop();
              $(settings.navigatorsDiv+' li:first-child').click();
            } else {
              if (!$(settings.contentsDiv).is(':animated')) {
                // bugixed from 0.9.54: now the navigators gets centered when there's too much navigators.
                $(settings.navigatorsDiv+' li').eq(currentIndex-1).trigger('click');
              }
            }
          } else if(settings.orientation == 'vertical') {
            var currentPositionContents = parseInt($(settings.contentsDiv).css('marginTop').substring(0,$(settings.contentsDiv).css('marginTop').indexOf('px')));
            var currentIssueIndex = currentPositionContents/heightIssue;
            var currentPositionNavigators = parseInt($(settings.navigatorsDiv).css('marginTop').substring(0,$(settings.navigatorsDiv).css('marginTop').indexOf('px')));
            var currentIssueDate = currentPositionNavigators+heightDate;
            if(currentPositionContents >= 0) {
              $(settings.contentsDiv).stop();
              $(settings.navigatorsDiv+' li:first-child').click();
            } else {
              if (!$(settings.contentsDiv).is(':animated')) {
                // bugixed from 0.9.54: now the navigators gets centered when there's too much navigators.
                $(settings.navigatorsDiv+' li').eq(currentIndex-1).trigger('click');
              }
            }
          }
          // prev/next buttons now disappears on first/last issue | bugfix from 0.9.51: lower than 1 issue hide the arrows
          if(howManyNavigators == 1) {
            $(settings.prevButton+','+settings.nextButton).addClass(settings.disabledButtonClass);
          } else if(howManyNavigators == 2) {
            if($(settings.contentsDiv+' li:first-child').hasClass(settings.contentsSelectedClass)) {
              $(settings.prevButton).addClass(settings.disabledButtonClass);
              $(settings.nextButton).removeClass(settings.disabledButtonClass);
            }
            else if($(settings.contentsDiv+' li:last-child').hasClass(settings.contentsSelectedClass)) {
              $(settings.nextButton).addClass(settings.disabledButtonClass);
              $(settings.prevButton).removeClass(settings.disabledButtonClass);
            }
          } else {
            if( $(settings.contentsDiv+' li:first-child').hasClass(settings.contentsSelectedClass) ) {
              $(settings.prevButton).addClass(settings.disabledButtonClass);
            }
            else if( $(settings.contentsDiv+' li:last-child').hasClass(settings.contentsSelectedClass) ) {
              $(settings.nextButton).addClass(settings.disabledButtonClass);
            }
            else {
              $(settings.nextButton+','+settings.prevButton).removeClass(settings.disabledButtonClass);
            }
          }
        });
        // keyboard navigation, added since 0.9.1
        if(settings.orientation=='horizontal') {
          $(document).keydown(function(event){
            if (event.keyCode == 39) {
                $(settings.nextButton).click();
              }
            if (event.keyCode == 37) {
                $(settings.prevButton).click();
              }
          });
        } else if(settings.orientation=='vertical') {
          $(document).keydown(function(event){
            if (event.keyCode == 40) {
                $(settings.nextButton).click();
              }
            if (event.keyCode == 38) {
                $(settings.prevButton).click();
              }
          });
        }
      }else {
        $(settings.nextButton).hide();
        $(settings.prevButton).hide();
      }
      // default position startAt, added since 0.9.3
      $(settings.navigatorsDiv+' li').eq(settings.startAt-1).trigger('click');
      // autoPlay, added since 0.9.4
      if(settings.autoPlay) {
        // set default timer
        var timer = setInterval(autoPlay, settings.autoPlayPause);
        // pause autoplay on hover
        $(settings.containerDiv).hover(function(ev){
          clearInterval(timer);
        }, function(ev){
          // start again timer on mouse out
          timer = setInterval(autoPlay, settings.autoPlayPause);
        });
        
      }
    }
  });
}

// autoPlay, added since 0.9.4
function autoPlay(){
  var currentDate = $(settings.navigatorsDiv).find('li.'+settings.navigatorsSelectedClass);
  if(settings.autoPlayDirection == 'forward') {
    if(currentDate.parent().is('li:last-child')) {
      $(settings.navigatorsDiv+' li:first-child').trigger('click');
    } else {
      currentDate.parent().next().trigger('click');
    }
  } else if(settings.autoPlayDirection == 'backward') {
    if(currentDate.parent().is('li:first-child')) {
      $(settings.navigatorsDiv+' li:last-child').trigger('click');
    } else {
      currentDate.parent().prev().trigger('click');
    }
  }
}
