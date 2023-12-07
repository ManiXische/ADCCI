/***************************************************************************************************
Extension Name: #{$ProjectName} 
File: isotope Initialize
Owner: Wael Gomaa
Version: 1.0.0
***************************************************************************************************/

$( document ).ready(function() {

    if($.fn.isotope){
        var isTablet =  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        var rtl = $.checkSiteRTLDirection();
        var $grid;
        var initializer = '[data-media-grid]';
        var instances = $(initializer);
    
        instances.each(function(idx , instance){
            if($(instance).data("media-grid") || $(instance).data("media-grid") == ''){
                        
                var guid  = $.guid++;
                // Getting items responsive count
                var itemsSelector = $(instance).data("selector") || '',
                gutter = $(instance).data("gutter") || '',
                activeFilter = $(instance).data("active-filter") || '';
                
                // Filter items on button click
                var filters = $("[data-filter]");

                itemsSelector = (itemsSelector && itemsSelector.indexOf(".") == -1  && itemsSelector.indexOf("#") == -1) ? ('.'+ itemsSelector) : itemsSelector;
                gutter = (gutter && gutter.indexOf(".") == -1 && gutter.indexOf("#") == -1) ? ('.' + gutter) : gutter;

                var activeFilterClass = $(instance).data("active-filter-class") || 'isotope-active'; 

                var fancyboxMode = $(instance).data("fancybox-mode"),
                thumbsPosition =  $(instance).data("fancybox-thumbs-position"),
                thumbsAutostart =  $(instance).data("fancybox-thumbs-autostart"),
                fancyboxEnabled =  $(instance).data("fancybox-enabled"),
                prevIcon =  'icon-chevron-left',
                nextIcon =  'icon-chevron-right';
    
                // default setter 
                thumbsAutostart = thumbsAutostart || thumbsAutostart === "";
                fancyboxEnabled = fancyboxEnabled || fancyboxEnabled === "";

                // handle seperate mode 
                // group each filter together 
                if(fancyboxEnabled && fancyboxMode == "seperate"){
                    filters.each(function(){
                        var filterSelector = $(this).attr('data-filter');
                        if(filterSelector != "*"){
                            var childs = $(filterSelector).children("a");
                            // adding group annotation to mark all un grouped items 
                            childs.each(function(idx , child){
                                var rel = $(child).attr('rel');
                                if(!rel){
                                    $(childs).attr("rel" , 'fancy-' + filterSelector.replace(".", ""));
                                }
                            })
                        }
                   });
                }

                function initFancybox(){
                    if($.fn.fancybox && fancyboxEnabled ){
                        $().fancybox({
                            baseClass : thumbsPosition ? ('fancybox-' + thumbsPosition) : '',
                            selector : itemsSelector + ' a:not(.fancybox-disabled)',
                            thumbs : {
                                hideOnClose: true,
                                autoStart : thumbsAutostart,
    
                                axis      :  (isTablet && thumbsPosition == 'bottom') ? 'x' : 'y',
                                defaults : {
                                    width    : 50,       // thumbnail width
                                    height   : 50,       // thumbnail height
                                    position : thumbsPosition, // 'top' or 'bottom'
                                },
                            },
                            helpers:  {
                                thumbs : {
                                    position : thumbsPosition,
                                    source   : function ( item ) {  // function to obtain the URL of the thumbnail image
                                            
                                        return href;
                                    }
                                }
                            },
                            btnTpl : {
                                arrowLeft: '<button data-fancybox-'+ (rtl ? 'next' : 'prev') +'="true" class="fancybox-button fancybox-button--arrow_left" title="{{'+ (rtl ? 'NEXT' : 'PREV') +'}}">' +
                                '<i class="'+ prevIcon +'"> </i>' +
                                "</button>",
                                arrowRight: '<button data-fancybox-'+(rtl ? 'prev' : 'next')+' class="fancybox-button fancybox-button--arrow_right" title="{{'+ (rtl ? 'PREV' : 'NEXT') +'}}">' +
                                '<i class="'+ nextIcon +'"> </i>' +
                                "</button>",
                                        }, 
                            beforeShow : function( instance, current ) {
    
                            },
                            keys : {
                                    next : {
                                        10000 : 'left', // enter
                                        10000 : 'up',   // page down
                                        10000 : 'left', // right arrow
                                        10000 : 'up'    // down arrow
                                    },
                                    prev : {
                                        10000  : 'right',  // backspace
                                        10000 : 'down',   // page up
                                        10000 : 'right',  // left arrow
                                        10000 : 'down'    // up arrow
                                    },
                    
                                close  : null
                            },
                            lang: rtl ? "ar" : "en",
                            i18n: {
                                en: {
                                CLOSE: "Close",
                                NEXT: "Next",
                                PREV: "Previous",
                                ERROR: "The requested content cannot be loaded. <br/> Please try again later.",
                                PLAY_START: "Start slideshow",
                                PLAY_STOP: "Pause slideshow",
                                FULL_SCREEN: "Full screen",
                                THUMBS: "Thumbnails",
                                DOWNLOAD: "Download",
                                SHARE: "Share",
                                ZOOM: "Zoom"
                                },
                                ar: {
                                CLOSE: "إغلاق",
                                NEXT: "التالي",
                                PREV: "السابق",
                                ERROR: "لا يمكن تحميل المحتوي المطلوب. <br/> الرجاء المحاولة لاحقا.",
                                PLAY_START: "بدأ العرض التفاعلي",
                                PLAY_STOP: "تعطيل مؤقت ",
                                FULL_SCREEN: "ملء الشاشة",
                                THUMBS: "صورة مصغرة",
                                DOWNLOAD: "تحميل",
                                SHARE: "مشاركة",
                                ZOOM: "تكبير"
                                }
                            }
                        });
                    }
                    
                }
                // first init
                initFancybox();
                
                // handling if rtl language 
                if(rtl){
                    $.fn.isotope.prototype._positionAbs = function( x, y ) {
                        return { right: x, top: y };
                    };
                }
                
                // Init Isotope
                    $grid = $(instance).isotope({
                    // options
                    itemSelector: itemsSelector || (initializer + ' > *'),

                    percentPosition: true,
                    masonry: {
                    // use outer width of grid-sizer for columnWidth
                        columnWidth: itemsSelector || (initializer + ' > *'),
                        gutter: gutter 
                    },

                    isOriginLeft: !rtl,

                    filter: activeFilter
                    // layoutMode: 'fitRows',
                    // percentPosition: true,
                    // fitRows: {
                    //   gutter: gutter
                    // }
                });
            
                $grid.isotope( 'on', 'arrangeComplete', function(args){
                    initFancybox();
                }); 

              
                filters.each(function(idx , filter){
                    $(filter).on("click" , function(){
                        $('.' + activeFilterClass).removeClass(activeFilterClass);
                        $(this).addClass(activeFilterClass);
                        var activeFilter = $(this).attr('data-filter');
        
                        if(fancyboxEnabled && fancyboxMode == "seperate"){
                            // integration with fancybox , fancybox for only the selected filter 
                            var items = $(itemsSelector).children("a");
                            items.removeClass('fancybox-disabled');

                            filters.each(function(){
                                if(activeFilter != $(this).attr("data-filter") && activeFilter != '*'){
                                    items = $(itemsSelector + ':not("'+ activeFilter +'")').children("a");
                                }

                                if(items && items.length){
                                    items.addClass('fancybox-disabled');
                                }
                            });
                        }

                        if(activeFilter == "*"){
                            items.removeClass("fancybox-disabled");
                        }

                        if($('iframe').length!==0){
                            for (let i = 0; i < $('iframe').length; i++)
                            $('iframe')[i].contentWindow.postMessage('{"event":"command","func":"' + 'pauseVideo' + '","args":""}', '*');    
                           }

                        // empty 
                        var noOfItems = $(itemsSelector).parent().find(activeFilter).length;
                        
                        if(!noOfItems){
                            $(".ex-media-grid__message").show();
                        }else {
                            $(".ex-media-grid__message").hide();
                        }

                        // setting the active filter 
                        $grid.isotope({ filter: activeFilter });
                    });
                });
            
                // update the layout when scroll to fit height
                var update = function(){
                    setTimeout(function(){
                        $grid.isotope('layout');
                        $grid.data("isotope").arrange();
                    }, 2000);
                          
                    var event;
                    if (typeof (Event) === "function") { 
                        event = new Event("grid-loaded"); }
                    else { 
                        event = document.createEvent("Event"); 
                        event.initEvent("grid-loaded", true, true); 
                    };
                    document.dispatchEvent(event);
                };

                // on load update the line 
                update();
            }
        });
    
             
    $(window).scroll(function(){
        $(initializer).each(function(idx , grid){
            $(grid).data("isotope") && $(grid).data("isotope").layout();
        });
    });
    }
});
