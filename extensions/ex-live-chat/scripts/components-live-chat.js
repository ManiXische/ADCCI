/***************************************************************************************************
Extension Name: \\ex-live-chat
File: component-live-chat
Owner: null
Version: 1.0.0
***************************************************************************************************/
$( document ).ready(function() {
    let baseClass= "ex-live-chat",
    popupCssClass = baseClass + "__popup";

    $("[data-live-chat]").click(function() {
        $("."+popupCssClass).toggleClass(popupCssClass + "--opened");
    });
});