
$(document).ready(function () {
    var rtl = $.checkSiteRTLDirection();
    var isTablet =  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    var leftNav = $(".ex-leftnav");
    var nav = $(".ex-leftnav nav");
    $('.ex-leftnav').removeClass("col-12");
    // $('.ex-leftnav li ').on('click', function (e) {
    //     var href = $(this).attr('href');
    //     if ($('.ex-leftnav li a').attr('href').startsWith('#') || ($('.ex-leftnav li a').attr('href').indexOf('#') == 0)) {

    //         $('.ex-leftnav li ').removeClass('active');
    //         $(this).addClass('active');
    //         $('html, body').animate({
    //             scrollTop: $(href).offset().top - 150
    //         }, '300');
    //         if (window.innerWidth <= 992) {
    //             $('.ex-leftnav').addClass('.ex-leftnav--fixedtop');
    //         }
    //         e.preventDefault();
    //     }

    // });

    //left navigation scroll into view
    function scrollNavintoview(leftnavitem){
      
        var prevSiblings = leftnavitem.prevAll();
        var nextSiblings = leftnavitem.nextAll();
        var width = 0;
        var lis = prevSiblings.map(function(idx , li){return $(li).width()});
            prevSiblings.each(function(){
             width += $(this).width();
        });
        if(!rtl){
            nav.scrollLeft(width - 50);
        }else{
            nav.scrollLeft(-(width - 50)); 
        }
       
    }
    //scroll left nav on load
    if(isTablet) {
        scrollNavintoview(nav.find(".active"))
    }


	// Select all links with hashes
	var inPageNvigationLinks = $('a[href*="#"]').not('[href="#"]').not('[href="#0"]');

	inPageNvigationLinks.first().parents("li").addClass("active");

    if(inPageNvigationLinks.length && !isTablet){

        leftNav.addClass("position-absolute");

        $(window).scroll(function () {
            var headerHeight = $(".ex-header").outerHeight() ;
            var scrolTop = $("html, body").scrollTop() - $(".column-splitter").offset().top;
            var topAmount = scrolTop + headerHeight;
            var deadEnd = (leftNav.height() + topAmount) > $(".column-splitter").height() ;
            if(!deadEnd){
                if(scrolTop > -headerHeight){
                    leftNav.css({top : topAmount});
                }else{
                    leftNav.css({top : 0});
                }
            }
        });
    }
	inPageNvigationLinks.click(function (event) {
		// On-page links
		if ( location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
			// Figure out element to scroll to
			var target = $(this.hash);
			target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
			// Does a scroll target exist?
			if (target.length) {
				// header height 
				var headerHeight = $(".ex-header").height() //$(".breadcrumb").outerHeight();
				// Only prevent default if animation is actually gonna happen
				event.preventDefault();
				$('html, body').animate({
					scrollTop: target.offset().top - headerHeight
				}, 500, function () {
					// Callback after animation
					// Must change focus!
					var $target = $(target);
					$target.focus();
					if ($target.is(":focus")) { // Checking if the target was focused
						return false;
					} else {
						// $target.attr('tabindex', '-1'); // Adding tabindex for elements not focusable
						// $target.focus(); // Set focus again
					};
				});

				// add active class
                $(this).parents("li").addClass("active").siblings().removeClass("active");

                  //scroll left nav on load in mobile 
                scrollNavintoview($(this).parents("li"))
                
                
			}
		}
    });
    

    // if($(".ex-leftnav .active")[0]){
    //     $(".ex-leftnav .active")[0].scrollIntoView();
    //     $("body")[0].scrollIntoView();
    // }
});



$(window).scroll(function () {
    var fixSidebar = $('.breadcrumb').innerHeight();
	 var innerHeaderHeight = $('.innerpage-headerbg').innerHeight();
    var contentHeight = $('main').innerHeight();
    if (window.innerWidth >= 1024) {


        var sidebarHeight = $('.ex-leftnav').height();
        sidebarHeight = parseInt(sidebarHeight) + 220;
        var sidebarBottomPos = contentHeight - sidebarHeight;
        var trigger = $(window).scrollTop() + fixSidebar;
        fixSidebar = parseInt(fixSidebar) + 150;

        if ($(window).scrollTop() >= fixSidebar) {
            $('ex-leftnav').addClass('stickynav_fixed');
			$('.ex-leftnav--fixed .ex-leftnav').css('top',innerHeaderHeight);
        } else {
            $('.ex-leftnav--fixed .ex-leftnav').removeAttr("style");
			$('ex-leftnav').removeClass('ex-leftnav--fixed');
        }

        if (trigger >= sidebarBottomPos) {
            $('ex-leftnav').addClass('ex-leftnav--fixedbottom');
        } else {
            $('ex-leftnav').removeClass('ex-leftnav--fixedbottom');
        }
    }
    if (window.innerWidth <= 992) {
        var brkpoint = $('.innerpage-headerbg').innerHeight();
        console.log("brkpoint "+brkpoint);
        if (window.innerWidth <= 767){
            brkpoint = parseInt(brkpoint)-25;
        }
        if ($(window).scrollTop() >= brkpoint) {

            $('.ex-leftnav ').addClass('ex-leftnav--fixedtop');
        } else {
            $('.ex-leftnav ').removeClass('ex-leftnav--fixedtop');
        }
    }

});