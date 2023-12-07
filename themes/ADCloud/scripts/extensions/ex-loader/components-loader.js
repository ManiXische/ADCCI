/***************************************************************************************************
Extension Name: \\ex-loader
File: component-loader
Owner: rana abbassy
Version: 1.0.0
***************************************************************************************************/
"use strict";


    function initLoader() {
        // Here, the ease animation will be use for the global drawing.
        var loaders = document.querySelectorAll('.ex-loader');
        var editorMode = document.querySelectorAll('.on-page-editor').length;
        if(loaders && !editorMode){
            // disable scroll bar 
            $("body").addClass("overflow-hidden");

            [].map.call(loaders, function(loader){
                // loader initialized 
                $(loader).addClass("ex-loader--initialized");

                var animationType = (loader.dataset.animationType) ? loader.dataset.animationType : "delayed";
                var animationDuration = (loader.dataset.animationDuration) ? loader.dataset.animationDuration : "200";
                var svgUrl = (loader.dataset.svgUrl) ? loader.dataset.svgUrl : "";
                if(svgUrl){
                    $.ajax({
                        method: "GET",
                        url: svgUrl,
                        dataType: 'html',
                        data: {  }
                      })
                    .done(function( data ) {
                        $(loader).find('.ex-loader__loader').remove();
                        $(loader).prepend(data);
                        _initSvgAnimation(loader.querySelector('svg'), animationType, animationDuration); 
                        // setTimeout(function(){
                        //     $(loader).find('.ex-loader__loader').remove(); 
                        //     $(loader).prepend(data);
                        //     _initSvgAnimation(loader.querySelector('svg'), animationType, animationDuration);
                        // }, 1500);
                    });
                }else{
                    _initSvgAnimation(loader.querySelector('svg'), animationType, animationDuration);
                } 
            })
        }
    }
    function _initSvgAnimation (loader, animationType, animationDuration){
        if(loader){
            var myvivus = new Vivus( loader, {
                type: animationType,
                duration: animationDuration,
                start: 'autostart',
                animTimingFunction: Vivus.EASE
            }, function (myVivus1) {
                myVivus1.play(myVivus1.getStatus() === 'end' ? -1 : 1);
            }); 
        }
    }
    function loadHandler () {
        setTimeout(_removeLoader, 2000);
    }
    function _removeLoader (){
        // enable scroll bar 
        $("body").removeClass("overflow-hidden");
        
        $(".ex-loader--initialized" ).fadeOut(500, function() {
            $( ".ex-loader" ).remove(); 
        });  
    }

    $(window).on( 'load', loadHandler );
    
    $().ready(function() {
        initLoader();
    });
