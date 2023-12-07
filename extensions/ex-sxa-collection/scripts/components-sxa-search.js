
$(document).ready(function () {

    $(".search-box-button , .search-box-button-with-redirect").addClass('icon-search').removeClass("icon icon-searchv2").text("");


    //For hiding autosuggest list when clicking
    $("body").click(function(e) {
        if($(e.target).closest('.search-box-input.tt-input').length)
            return;

        $('.tt-menu.tt-open').css("display", "none");
    });

    $('.search-box-input.tt-input').click(function(e) {
        if($('.tt-menu').find('.tt-dataset.tt-dataset-1').children().length != 0)
        {
            $('.tt-menu.tt-open').css("display", "block");
        }
    });

});