/***************************************************************************************************
Extension Name: \\ex-mega-menu
File: component-mega-menu
Owner: waqas-khan-omnia
Version: 1.0.0
***************************************************************************************************/
$(document).ready(function (){
    //Search Overlay
    $('.ex-mega-menu .search-btn > i').click( function () {
        $('.ex-mega-menu .search-overlay').addClass('search-overlay--append');
    });
    $('.ex-mega-menu .search-overlay__close').click( function () {
        $(this).parent().removeClass('search-overlay--append');
        $('.ex-mega-menu .search-overlay__input[type="text"]').val('');
    });
});