/***************************************************************************************************
Extension Name: #{$ProjectName} 
File: Fancybox Initialize
Owner: Wael Gomaa
Version: 1.0.0
***************************************************************************************************/


$(document).ready(function(){

    if($.fn.fancybox){
        var instances = $("[data-fancy]");
        var rtl = $.checkSiteRTLDirection();
        var isTablet =  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        instances.each(function(idx , instance){

            // Getting options
            var thumbsposition = $(instance).data("thumbs-position") || 'bottom',
            thumbsAutostart =  $(instance).data("thumbs-autostart"),
            
            disableArrows = $(instance).data().hasOwnProperty("disableArrows") && $(instance).data("disableArrows") ,

            prevIcon = $(instance).data("prev-icon") || 'icon-chevron-left',
            nextIcon = $(instance).data("next-icon") || 'icon-chevron-right',

            infoSelector = $(instance).data("fancybox-info-extras");


            $(instance).fancybox({
                touch : false,
                thumbs : {
                    autoStart : thumbsAutostart || thumbsAutostart === "",
                    hideOnClose : true,
                    axis        : isTablet ? 'x' : 'y'
                },
                helpers:  {
                    thumbs : {
                        position : thumbsposition
                    }
                },
                btnTpl : !disableArrows ? {
                    arrowLeft: '<button data-fancybox-'+ (rtl ? 'next' : 'prev') +'="true" class="fancybox-button fancybox-button--arrow_left" title="{{'+ rtl ? 'NEXT' : 'PREV'+'}}">' +
                    '<i class="'+ (rtl ? nextIcon : prevIcon) +'"> </i>' +
                    "</button>",
                    arrowRight: '<button data-fancybox-'+ (rtl ? 'prev' : 'next') +' class="fancybox-button fancybox-button--arrow_right" title="{{'+rtl ? 'PREV' : 'NEXT'+' }}">' +
                    '<i class="'+ (rtl ? prevIcon : nextIcon) +'"> </i>' +
                    "</button>",
                }: {}, 
                beforeShow : function(  ) {
                    // place info selector to infobar
                    if(infoSelector) {
                        $(".fancybox-infobar").empty();
                        $(infoSelector).clone().show().appendTo($(".fancybox-infobar"));
                    }
                },
                keys : {
                    
                        next : {
                            10000 : 'left', // enter
                            // 10000 : 'up',   // page down
                            // 10000 : 'left', // right arrow
                            // 10000 : 'up'    // down arrow
                        },
                        prev : {
                            10000  : 'right',  // backspace
                            // 10000 : 'down',   // page up
                            // 10000 : 'right',  // left arrow
                            // 10000 : 'down'    // up arrow
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
            
        });
        
        // dialog helper 
        $.dialog = function( opts ) {
            opts  = $.extend( true, {
            title     : '',
            message   : '',
            dialogClass: '',
            dialogTitleClass: '',
            dialogMessageClass: '',
            dialogFooterClass: '',
            dialogHeaderClass : '',
            dialogCancelButtonClass: '',
            dialogOkButtonClass: '',
            dialogBaseTemplateClass: '',
            closeButton : '',
            okButton  : rtl ? "حسنا": 'Ok',
            cancelButton  : '',
            callback  : $.noop
            }, opts || {} );
        
            $.fancybox.open({
            type : 'html',
            src  :
            '<div class="dialog-component '+ (opts.dialogClass)+'">' +
            (opts.title ? '<header class="dialog-component__header '+ (opts.dialogHeaderClass)+'"><h4 class="'+ (opts.dialogTitleClass)+'">' + opts.title   + '</h4></header>' : '') +
            (opts.closeButton ? '<i class="dialog-component__close '+ (opts.closeButton)+'" data-fancybox-close data-value="0"></i>': '') +
            (opts.message ? '<div class="dialog-component__message '+ (opts.dialogMessageClass)+'">'  + opts.message + '</div>': '') +
            '<div class="dialog-component__footer '+ (opts.dialogFooterClass)+'">' +
            (opts.cancelButton ? '<button class="dialog-component__footer__button button '+( opts.dialogCancelButtonClass)+'" data-value="0" data-fancybox-close>' + opts.cancelButton + '</button>' : '')+
            (opts.okButton ? '<button class="button '+ (opts.dialogOkButtonClass )+'" data-value="1" data-fancybox-close class="btn">' + opts.okButton + '</button>'  : '') +
            '</div>' +
            '</div>',
            opts : {
                animationDuration : 350,
                animationEffect   : 'material',
                modal : true,
                baseTpl :
                '<div class="fancybox-container fc-container '+ (opts.dialogBaseTemplateClass) +'" role="dialog" tabindex="-1">' +
                '<div class="fancybox-bg"></div>' +
                '<div class="fancybox-inner">' +
                '<div class="fancybox-stage"></div>' +
                '</div>' +
                '</div>',
                afterClose : function( instance, current, e ) {
                    var button = e ? e.target || e.currentTarget : null;
                    var value  = button ? $(button).data('value') : 0;
                    opts.callback( value );
                }
            },
            btnTpl: {
                close : ""
            },
            touch: false,
            });
        }

        // open auto show fancyboxes 
        if($(".dialog-component--auto").length){
            $.fancybox.open({
                src  : '.dialog-component--auto',
                type : 'inline',
                touch: false,

                btnTpl: {
                    close : ""
                },
                smallBtn : false,
            });
        }

    }
  });