/***************************************************************************************************
Extension Name: \\ex-accordion
File: component-accordion
Owner: Wael Gomaa
Version: 1.0.0
***************************************************************************************************/
function activateAccordion(){
    var instances = $("[data-accordion]");

    var isTablet =  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    var rtl = $.checkSiteRTLDirection();
    var accordionBase = "ex-accordion",
    accordionItem = accordionBase + '__item',
    accordionItemExpanded = accordionItem + '--expanded';
    var headerHeight = $(".ex-header").height();

    instances.each(function(idx , instance){
        var guid  = $.guid++;
        var parentid = 'accordion-' + guid;

        // find custom item 
        if($(instance).data().hasOwnProperty("item")){
            accordionItem = $(instance).data("item");
            accordionItemExpanded = accordionItem + '--expanded';
        }
        
        let childs =  $(instance).find('.' + accordionItem );

        // check if the accordion self 
        if($(instance).data().hasOwnProperty("self") && $(instance).data("self")){
            childs = $(instance);
        }
        

        if(childs.length){
 
            var showFirst = $(instance).data().hasOwnProperty("showFirst") || $(instance).data("show-first"),
            onlyOne = $(instance).data().hasOwnProperty("singleOpen") || $(instance).data("single-open"), 
            activeClass = $(instance).data("active-class") || '';

            // // init the accordion 
            // $(instance).addClass(accordionBase);
            $(instance).attr("id" , parentid);
            // $(instance).slideDown();
            // unbind the previous clicks before load more triggered 
            $(instance).find(".accordion-trigger__collapse , .accordion-trigger--collapse").unbind("click");
            // bind new click events 
            $(instance).find('.accordion-trigger__collapse , .accordion-trigger--collapse').on('click', function (evt) {
                var item = $(evt.target).parents('.' + accordionItem);
                var content =item.find("."+ accordionItem +"__content");
                if(content.is(":visible")){
                    item.removeClass(accordionItemExpanded).removeClass(activeClass);
                    content.slideUp(500);
                }
            });
            // unbind the previous clicks before load more triggered 
            $(instance).find(".accordion-trigger__expand , .accordion-trigger--expand").unbind("click");
            // bind new click events 
            $(instance).find('.accordion-trigger__expand , .accordion-trigger--expand').on('click', function (evt) {
                // collapse other items 
                var item = $(evt.target).parents('.' + accordionItem);
                var content = item.find("."+ accordionItem +"__content");

                if(!content.is(":visible")){
                    $('.' + accordionItem).removeClass(accordionItemExpanded).removeClass(activeClass)
                    .find("."+ accordionItem +"__content").slideUp(500)

                    item.addClass(accordionItemExpanded).addClass(activeClass);

                    content.slideDown(500);
                }

                // init truncate 
                if($.fn.truncate){
                    $(evt.target).parents('.' + accordionItem).find(".truncate").each(function() {
                        // only truncate if the text is longer than the desired size; if not, skip it
                        $(this).truncate();
                    });
                }
            });
            
            // childs.addClass(accordionItem);
            showFirst && childs.first().find("."+ accordionItem +"__content").slideDown(500);

            childs.each(function(idx, child){
                // to be removed 
                var documentCount = $(child).find(".documents-count"),
                documentCountText = documentCount.text();
                documentCount.text(documentCountText.replace("#{count}", $(child).find(".ex-icon-card").length));
            });

            // childs.addClass(accordionItem);
            // childs.first().find("[data-content]").addClass(showFirst ? 'show' : '');
            showFirst && childs.first().find("[data-toggle]").first().click();

            // open hashed by default 
            if(location && location.hash){
                $(location.hash).find("[data-toggle]").first().click();
            }

        }
    });

}

$(document).ready(function () {
     
    if(typeof XA != "undefined" && XA.component.search.vent){

        XA.component.search.vent.on("results-loaded", function () {
            activateAccordion();
        });
    }

    activateAccordion();

});