/***************************************************************************************************
Extension Name: \\ex-listing-page
File: component-ex-listing-page
Owner: ahmedalaaezzt
Version: 1.0.0
***************************************************************************************************/

$("document").ready(function () {
  //Clear All cta


  $("[listing_filters__wrap] [data-filter]").each(function(){
    var filter = $(this);
    filter.find("span[clear]").click(function () {
      $(this).closest("[data-filter]").find('input').prop("checked", false);
    });
 })
  

  //show "Show more" cta if we have items more that 5 in the categories
  $("[listing_filters__wrap] [has_showmore]").each(function(){
    if ($(this).find("input").length > 7) {
      $(this).find("span[show='more']").css("display", "inline");
    }
 })


  //hide all checkboxs more than 5 items
  $("[listing_filters__wrap] [has_showmore]").each(function(){
    $(this).find("div[custom-checkbox]").each(function(index){
      if (index > 5) {
        $(this).css("display", "none");
      }
   })
 })


  //show more cta appear all items in categories list
  $("span[show='more']").click(function () {
    var parent = $(this).closest("[group]");
    parent.find("div[custom-checkbox]").each(function () {
      $(this).css("display", "block");
    });
    parent.find("span[show='more']").css("display", "none");
    parent.find("span[show='less']").css("display", "inline");
  });

  //show less cta disapper all items more than 5
  $("span[show='less']").click(function () {
    var parent = $(this).closest("[group]");
    parent.find("div[custom-checkbox]").each(function (index) {
        if (index > 5) {
            $(this).css("display", "none");
        }
    });

    parent.find("span[show='less']").css("display", "none");
    parent.find("span[show='more']").css("display", "inline");
  });


  //check all
  $("[custom-checkbox ] [check-all] input").each(function(){
     $(this).change(function(e){
        $( ".ex-listing-page_group[group='"+$(this).parent().attr("group")+"'] input").prop("checked", e.target.checked);
     });
    
  })

  // if checked last checkbox update checkAll option 
  var allInputs = $("[custom-checkbox ] .checkbox__wrapper:not([check-all]) input");
  
  allInputs.each(function(index){

    $(this).change(function(e){
      var parent = $(this).closest('[data-filter]');
      var allInputsLength = parent.find("[custom-checkbox ] .checkbox__wrapper:not([check-all]) input").length;
      var checkedLength = parent.find("[custom-checkbox ] .checkbox__wrapper:not([check-all]) input:checked").length
      if((checkedLength) == allInputsLength){
        parent.find("[custom-checkbox ] [check-all] input").prop('checked', true);
      }else{
        parent.find("[custom-checkbox ] [check-all] input").prop('checked', false);
      }
    });
   
 })
});
