$(document).ready(function () {
  var rtl = $.checkSiteRTLDirection();

  if($.datepicker){
    // arabic localization
    var arDictonary = {
      closeText: "إغلاق",
      prevText: "&#x3C;السابق",
      nextText: "التالي&#x3E;",
      currentText: "اليوم",
      monthNames: [ "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو","يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر" ],
      monthNamesShort: [ "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر" ],
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

    $.datepicker.regional.ar = $.extend({
      isRTL: rtl,
      showAnim : "slideDown",
    }, arDictonary );
    $.datepicker.setDefaults($.datepicker.regional.ar);
  }
});