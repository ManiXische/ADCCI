
$(document).ready(function () {
    var baseClass = ".ex-sitecore-form",
    inputCssClass = baseClass + "__input--datepicker";
    // init date picker to input 
    $(inputCssClass).find("input[type='text']").attr("autocomplete" , "off").datepicker();
});