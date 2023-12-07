/***************************************************************************************************
Extension Name: \\ex-timeline-horizontal
File: component-timeline-horizontal
Owner: waqas-khan-omnia
Version: 1.0.0
***************************************************************************************************/
$(document).ready(function() {

    timeline(document.querySelectorAll('.timeline'), {
        forceVerticalMode: 991,
        mode: 'horizontal',
        verticalStartPosition: 'left',
        visibleItems: 4,
        moveItems: 2 
        //rtlMode: true
    });

    if ($('html').is(':lang(ar)')) {
        timeline(document.querySelectorAll('.timeline'), {
            forceVerticalMode: 991,
            mode: 'horizontal',
            verticalStartPosition: 'right',
            visibleItems: 4,
            moveItems: 2,
            rtlMode: true
        });
    }

    

});