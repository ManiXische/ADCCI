/***************************************************************************************************
Extension Name: #{$ProjectName} 
File: Highlights
Owner: Wael Gomaa
Version: 1.0.0
***************************************************************************************************/

$(document).ready(function () {


    // handle slick progress bar
    var baseClasshighlights = '.ex-image-highlights';
    var highlightsSlickSelector = baseClasshighlights + '__slides';
    var highlightsSlick = $(highlightsSlickSelector) && $(highlightsSlickSelector).data("slick") && $(highlightsSlickSelector).slick('getSlick');

    if ($(baseClasshighlights).length && !$(baseClasshighlights).hasClass(baseClasshighlights.replace("." , "") + "-v2")) {

            var isAutoPlay = !!($(highlightsSlickSelector).data() && $(highlightsSlickSelector).data().hasOwnProperty("autoplay") && ($(highlightsSlickSelector).data("autoplay") != '' && !!$(highlightsSlickSelector).data("autoplay"))),
            isInfinite = $(highlightsSlickSelector).data("infinite") || true,
            arrowsEnabled = $(highlightsSlickSelector).data("enablearrows"),
            speed = $(highlightsSlickSelector).data("autoplayspeed") || 5000,
            headerHeight = $(".ex-header").height();


        var currentHolder = $('.ex-image-highlights__navigation .slide-progress__current'),
            countHolder = $('.ex-image-highlights__navigation .slide-progress__count'),
            progressBar = $('.ex-image-highlights__navigation .slide-progress__bar__line');

        function updateCoutns(count, current) {
            // update html
            if(current){
                currentHolder.html(current);
                countHolder.text(count);
            }
        }

        function animate() {
            progressBar.animate({
                width: "100%"
            }, speed, function () {
                // $(highlightsSlickSelector).slick('slickNext');
                // startProgressbar();
            });
        }

        if (arrowsEnabled) {
            $('.ex-image-highlights__navigation .arrows').attr("style", "opacity: 1");
        }
        if (highlightsSlick && isAutoPlay && highlightsSlick.$slides.length > 1) {

            // show slider options 
            $('.ex-image-highlights__navigation .slide-progress').attr("style", "opacity: 1");


            if ($(highlightsSlickSelector).data().hasOwnProperty("progress") && ($(highlightsSlickSelector).data("progress") || $(highlightsSlickSelector).data("progress") == '')) {
                var count = highlightsSlick.slideCount,
                    current = highlightsSlick.currentSlide + 1,
                    calc = (current / count) * 100;

                // update html
                // updateCoutns(count, current);

                // progressBar.animate({
                //     width: calc + "%"
                // }, 200);


                $(highlightsSlickSelector).on('init beforeChange', function (event, slick) {

                    var count = slick.slideCount,
                        current = slick.currentSlide + 1,
                        calc = (current / count) * 100;

                    // update html
                    updateCoutns(count, current);

                    // progressBar.animate({
                    //     width: calc + "%"
                    // }, 200);
                });

            }

            if ($(highlightsSlickSelector).data().hasOwnProperty("loader") && ($(highlightsSlickSelector).data("loader") || $(highlightsSlickSelector).data("loader") == '')) {
                // handle loader animation
                var count = highlightsSlick.slideCount,
                    current = highlightsSlick.currentSlide + 1;

                // update html
                updateCoutns(count, current);

                var isPause,
                    percentTime,
                    isLast;


                // hover events
                $(highlightsSlickSelector).on({
                    mouseenter: function () {
                        isPause = true;
                        progressBar.stop(true);
                    },
                    mouseleave: function () {
                        isPause = false;
                        // resume 
                        animate();
                    }
                })

                function startProgressbar() {
                    resetProgressbar();
                    percentTime = 0;
                    isPause = false;
                    if (!isInfinite && isLast) {
                        $(progressBar).parent().hide();
                        $(currentHolder).hide();
                        $(countHolder).hide();
                        return;
                    }
                    // tick = setInterval(interval, 0);
                    animate();

                    if (count == highlightsSlick.currentSlide + 1) {
                        isLast = true;
                    }
                }

                function resetProgressbar() {
                    progressBar.stop(true);
                    progressBar.css({
                        width: '0%'
                    });

                    // update html
                    // var count = highlightsSlick.slideCount,
                    //     current = highlightsSlick.currentSlide + 1;

                    // updateCoutns(count, current);
                }
                startProgressbar();


                $(highlightsSlickSelector).on('afterChange', function (event, slick) {

                    var count = slick.slideCount,
                        current = slick.currentSlide + 1;

                    // update html
                    updateCoutns(count, current);
                    resetProgressbar();
                    startProgressbar();
                });
            }

            if (!($(highlightsSlickSelector).data().hasOwnProperty("loader") && ($(highlightsSlickSelector).data("loader") || $(highlightsSlickSelector).data("loader") == '')) &&
                !($(highlightsSlickSelector).data().hasOwnProperty("progress") && ($(highlightsSlickSelector).data("progress") || $(highlightsSlickSelector).data("progress") == ''))) {
                $(progressBar).parent().hide();
            }
        }



        // handle scroll-down 
        $(".highlights-scroll-down").click(function () {
            if (typeof Scrollbar != "undefined" && Scrollbar.get(document.querySelector("body"))) {
                Scrollbar.get(document.querySelector("body")).scrollTo(0, ($(highlightsSlickSelector).height() - $headerHeight), 500);
            } else {
                $("html, body").animate({
                    scrollTop: $(highlightsSlickSelector).height() - (headerHeight - 25)
                }, 500);
            }
        });
    }

    // check header height 
    function checkHeaderHeight (headerHeight){
        if ($(".ex-header").length) {
            $(".ex-image-highlights-v2").animate( {"paddingTop" : headerHeight + "px"} , 800);
            $(".ex-inner-header").animate( {"marginTop" : (headerHeight-109) + "px"} , 800);
        }
    }
    $(window).on("resize",function(){
        var headerHeight = ($(".ex-announcement").outerHeight() || 0) + ($(".ex-header__wrapper").outerHeight() || 0);
        checkHeaderHeight(headerHeight);
    });
    $(window).on( "announcement-closing", function(){
        var headerHeight = $(".ex-header__wrapper").outerHeight() || 0;
        checkHeaderHeight(headerHeight);
    });
    $(window).on( "window-zoom-changed", function(){
        highlightsSlick && $(highlightsSlickSelector).slick('resize');
    });
    setTimeout(function(){
        var headerHeight = ($(".ex-announcement").outerHeight() || 0) + ($(".ex-header__wrapper").outerHeight() || 0);
        checkHeaderHeight(headerHeight);
    } , 2000);
});