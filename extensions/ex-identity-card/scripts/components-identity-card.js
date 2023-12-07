/***************************************************************************************************
Extension Name: \\ex-identity-card
File: component-identity-card
Owner: Mahmoud
Version: 1.0.0
***************************************************************************************************/

$(document).ready(function () {
  toHeight = 565,
  cloned = null; 
  
function animateCard(that){
  var position =$(that).offset();
      var x      = position.left;
      var y      = position.top;
      var height = $(that).outerHeight();

      // dismiss animation
      dismissAnimation(that);
    
      cloned = $(that)
      .clone()
      .css({
        position: 'absolute',
        width:  $(that).outerWidth(),
        height : height,
        zIndex: 50000,
        left: x,
        top: y
      }).removeClass("ex-identity-card--double-expand--org")
      .addClass("ex-identity-card--double-expand--face ex-identity-card--double-expand--clone")
      .hover(function(){
        // doing nothing 
      }, function(){
        dismissAnimation(that);
      }).appendTo("body")

      $(cloned).find(".card-title-large").show();
      $(cloned).find(".card-title-small").remove();
      
      $(".ex-identity-card__overlay").show();

      // $(that).addClass("ex-identity-card--double-expand--hover");
      $(cloned).animate({
        "height" : toHeight + "px",
        top:   y - ((toHeight - height) / 2)
      }, 400, function(){
        // $(that).attr("data-top" , y).css("top" , ($(this).offset().top - $(that).offset().top) + "px");
      });
}

function dismissAnimation(that){
  $(that).removeClass("ex-identity-card--double-expand--hover");

  $(".ex-identity-card--double-expand--clone").animate({
    height : $(that).outerHeight(),
    top:   $(that).offset().top
  }, 400 , function(){
    $(this).remove();
  });
  $(".ex-identity-card__overlay").hide();

}


$('.ex-identity-card--double-expand--org').hover(function () {
  var isTablet =  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  if (!($("body").hasClass("on-page-editor") || isTablet))
    animateCard(this);
}, function () {
  // dismiss animation
  // if(!$(".ex-identity-card--double-expand--clone:hover").length){
  //   dismissAnimation(this);
  // }
});

// $(".ex-identity-card--double-expand--org").on({ 'touchstart' : function(){
//     dismissAnimation(this);
//   }
// });
});