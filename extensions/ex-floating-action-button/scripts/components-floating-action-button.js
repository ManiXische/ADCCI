/***************************************************************************************************
Extension Name: \\ex-floating-action-button
File: component-floating-action-button
Owner: ahmedalaaezzt
Version: 1.0.0
***************************************************************************************************/
var checkExist = setInterval(function () {
    if ($(".ui-lib-global-csat-feedback-js-open-buttons").length) {
        var csat = $(".ui-lib-global-csat-feedback-js-open-buttons").first();
        var position = csat.position();
        $(".ex-floating-action-button").css({top: position.top - 55});
      
        clearInterval(checkExist);
    }
}, 100);