
  $(document).ready(function() {
    
    var rtl = $.checkSiteRTLDirection();

    var pathname = window.location.pathname,
    selector = '.ex-header__right-section__upper-navigation-menu li';
    $(selector + " a").each(function(idx, item){
        if($(item).attr("href") == pathname){
            $(item).closest("li").addClass("current");
        }
    });


    var marker = $('.navigation-marker'),
        current = $(selector + '.current');

    if(current.length){
        // Initialize the marker position and the active-nav class
        current.addClass('active-nav');
        marker.css({
            // Place the marker in the middle of the border
            // bottom: -(marker.height() / 2),
            left: current.position().left,
            width: current.outerWidth(),
            display: "block"
        });
    }
    if (typeof Modernizr != "undefined" &&  Modernizr.csstransitions) {
        $(selector).mouseover(function () {
            var self = $(this),
                offset = self.position().left,
                // Use the element under the pointer OR the current page item
                width = self.outerWidth() /*|| current.outerWidth(),*/
                // Ternary operator, because if using OR when offset is 0, it is considered a falsy value, thus causing a bug for the first element.
                amount = offset == 0 ? 0 : offset; /*|| current.position().left;*/

            // Play with the active-nav-mark class
            $('.active-nav').removeClass('active-nav');
            self.addClass('active-nav');
            marker.css({
                left: amount,
                width: width,
                display: "block"
            });
        });

        // When the mouse leaves the menu
        $(selector).parent().mouseleave(function () {
            // remove all active-nav classes, add active-nav class to the current page item
            $('.active-nav').removeClass('active-nav');
            if(current.length){
                current.addClass('active-nav');
            
                // reset the marker to the current page item position and width
                marker.css({
                    left: current.position().left,
                    width: current.outerWidth(),
                });
            }
            else{
                marker.css({
                    display: "none"
                });
            }
            
        });

    } else {

        $(selector).mouseover(function () {
            var self = $(this),
                offset = self.position().left,
                // Use the element under the pointer OR the current page item
                width = self.outerWidth() /*|| current.outerWidth(),*/
                // Ternary operator, because if using OR when offset is 0, it is considered a falsy value, thus causing a bug for the first element.
                amount = offset == 0 ? 0 : offset; /*|| current.position().left;*/

            // Play with the active-nav class
            $('.active-nav').removeClass('active-nav');
            self.addClass('active-nav');
            marker.stop().animate({
                left: amount,
                width: width,
                display: "block"
            }, 300);
        });

        // When the mouse leaves the menu
        $(selector).parent().mouseleave(function () {
            // remove all active-nav classes, add active-nav class to the current page item
            $('.active-nav').removeClass('active-nav');
            if(current.length){
                current.addClass('active-nav');
                // reset the marker to the current page item position and width
                marker.stop().animate({
                    left: current.position().left,
                    width: current.outerWidth(),
                }, 300);
            } else{
                marker.stop().animate({
                display: "none"}, 300)

            }
        });
    };
    



    // $(".sidemenu__dismiss-menu, .overlay").on("click", function() {
    //   $("#sidebar").removeClass("sidemenu--active");
    //   $(".overlay").removeClass("overlay--active");
    //   $(".collapse.in").toggle("slide");
    // });

    $("#sidebarCollapse , .overlay").on("click", function() {
      $(".ex-header__right-section__search-dismiss").click();
      $("#sidebar").toggleClass("sidemenu--active");
      $("#sidebarCollapse .menu-icon").toggleClass("menu-icon--active");
      $(".overlay").toggleClass("overlay--active");
      $(".collapse.in").toggle("slide");
      $("#sidebarCollapse .menu-icon").toggleClass("is-active");
    });


    $(".ex-header__right-section__search-icon").on("click", function() {
      $(".search-box").addClass("search-box--active");
      $(".ex-header__left-section").css("z-index","0");
      $(".ex-header__right-section__search-dismiss").show();
      $(".ex-header__right-section__search-icon").hide();
      
    });
    
    $(".ex-header__right-section__search-dismiss").on("click", function() {
        $(".search-box").removeClass("search-box--active");
        $(".ex-header__left-section").css("z-index","90");
        $(".ex-header__right-section__search-dismiss").hide();
        $(".ex-header__right-section__search-icon").show();
    });
    
    // open settings part
    $("[data-settings]").on("click", function() {
        $(".ex-header__right-section__icon-wrp__overlay").hide();

        function closeSideBar(){
            $(".ex-header__right-section__search-dismiss").click();
            $("#sidebarCollapse .menu-icon--active").parent().click();
        }

        if($(".settings-wrp").hasClass("settings-wrp--active")){
            if(rtl){
                $(".settings-wrp").css({"right" : "auto"}).animate({ "left" : '-100%'}, 500 , closeSideBar).removeClass("settings-wrp--active");
            }else {
                $(".settings-wrp").css({"left" : "auto"}).animate({ "right" : '-100%'}, 500,closeSideBar).removeClass("settings-wrp--active");
            }
            $(".ex-header__right-section__icon-wrp__overlay").hide();
        }else {
            if(rtl){
                $(".settings-wrp").css({"right" : "auto"}).animate({"left" : 0}, 500,closeSideBar).addClass("settings-wrp--active");
            }else {
                $(".settings-wrp").css({"left" : "auto"}).animate({"right" : 0}, 500,closeSideBar).addClass("settings-wrp--active");
            }
            $(".ex-header__right-section__icon-wrp__overlay").show();
        }
    });
  });
