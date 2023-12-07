$("document").ready(function () {

  //open the filter popup 
  $("[filter-button").click(function () {
    $("[ex-listing-page-overlay]").removeClass("d-none")
    $("[ex-listing-page-form]").removeClass("d-none")
  });

  //close filter popup
  $("[form-close], [form-apply]").click(function(){
     $("[ex-listing-page-overlay]").addClass("d-none")
     $("[ex-listing-page-form]").addClass("d-none")
  })



  if ( (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/.test(navigator.userAgent.toLowerCase())) 
        && window.innerWidth < 1366){
    //moving the search control to form popup
    var searchCompoent = $("[ex-listing-search]").clone(true,true)
    var sortCompoent = $("[listing_sort__wrap]").clone(true,true)
    var filterCompoent = $("[listing_filters__wrap]").clone(true,true)

    //removing desktop elements
    $("[ex-listing-search]").remove();
    $("[listing_sort__wrap]").remove();
    $("[listing_filters__wrap]").remove();

    //add cloned elements to the popup form
    $("[ex-listing-page-form-body]").append(searchCompoent);
    $("[ex-listing-page-form-body]").append(sortCompoent);
    $("[ex-listing-page-form-body]").append(filterCompoent);
    


  }
 
  
});
