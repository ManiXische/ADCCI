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
            
            $('#'+ parentid).on('hidden.bs.collapse', function (evt) {
                $(evt.target).parent().removeClass(accordionItemExpanded).removeClass(activeClass);
            })
            $('#'+ parentid).on('shown.bs.collapse', function (evt) {
                $(evt.target).parent().addClass(accordionItemExpanded).addClass(activeClass);

                // // scroll to this item
                // $('html, body').animate({
                //     scrollTop: $(evt.target).parent().offset().top - headerHeight - 20
                // }, 100);

                // init truncate 
                if($.fn.truncate){
                    $(evt.target).find(".truncate").each(function() {
                        // only truncate if the text is longer than the desired size; if not, skip it
                        $(this).truncate();
                    });
                }
            });
            
            // childs.addClass(accordionItem);
            childs.first().find("[data-content]").addClass(showFirst ? 'show' : '');

            childs.each(function(idx, child){
                var childId = parentid + '-child-' + idx;
                $(child).find("[data-toggle]").attr("data-target" ,'#' + childId).attr("aria-controls" ,childId).attr("aria-expanded" ,"true");
                $(child).find("[data-heading]").attr("id" , childId + '-heading');
                $(child).find("[data-content]").attr("id" ,childId).attr("data-parent" ,'#' + parentid).attr("aria-labelledby" , childId + '-heading');

                // to be removed 
                var documentCount = $(child).find(".documents-count"),
                documentCountText = documentCount.text();
                documentCount.text(documentCountText.replace("#{count}", $(child).find(".ex-icon-card").length));
            });
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



    // to be removed 


});