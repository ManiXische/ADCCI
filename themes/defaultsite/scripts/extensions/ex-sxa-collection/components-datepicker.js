$(document).ready(function () {
  var rtl = $.checkSiteRTLDirection();
  var baseClass = ".ex-sitecore-form",
  inputCssClass = baseClass + "__input--datepicker";

  if($.datepicker){
    // arabic localization
    $.datepicker.regional.ar = {
      closeText: "إغلاق",
      prevText: "&#x3C;السابق",
      nextText: "التالي&#x3E;",
      currentText: "اليوم",
      monthNames: [ "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
      "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر" ],
      monthNamesShort: [ "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12" ],
      dayNames: [ "الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت" ],
      dayNamesShort: [ "أحد", "اثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت" ],
      dayNamesMin: [ "ح", "ن", "ث", "ر", "خ", "ج", "س" ],
      weekHeader: "أسبوع",
      // dateFormat: "dd/mm/yy",
      firstDay: 0,
        isRTL: true,
      showMonthAfterYear: false,
      yearSuffix: "" 
    };

    $(inputCssClass).find("input[type='text']").attr("autocomplete" , "off").datepicker( $.extend({
      showAnim : "slideDown",
      isRTL: rtl,
    } , $.datepicker.regional[rtl ? "ar" : "en"]));
  }
});