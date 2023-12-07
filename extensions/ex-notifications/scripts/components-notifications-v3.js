/***************************************************************************************************
Extension Name: \\ex-notifications
File: component-notifications
Owner: tawfik
Version: 1.0.0
***************************************************************************************************/

$(document).ready(function () {

  var dir =  $.checkSiteRTLDirection() ? 'rtl':'ltr'
  $('.ex-notifications-v3-breaking-news').breakingNews({
    effect: 'slide-left',
    direction: dir
  });

  });

