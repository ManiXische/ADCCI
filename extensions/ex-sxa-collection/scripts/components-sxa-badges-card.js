/***************************************************************************************************
Extension Name: \\ex-sxa-badges-card
File: component-sxa-badges-card
Owner: tawfik
Version: 1.0.0
***************************************************************************************************/
$(document).ready(function () {
    var rtl = $("html").attr("lang") == 'ar-AE';

    // calculate event ongoing 
    $(".event-checkStartDate").each(function () {

        if (rtl) {

            var currentArabicStartDate = $(".event-checkStartDate").text();
            var currentArabicEndDate = $(".event-checkEndDate").text();

            if (currentArabicStartDate && currentArabicEndDate) {

                var splittedDate = currentArabicStartDate.split("/");
                var day = splittedDate[0];
                var month = splittedDate[1];
                var amOrPm = splittedDate[2].split(" ");
                var year = amOrPm[0];
                var time = amOrPm[1];
                var timing = amOrPm[2];
                var engTiming = "";
                if (timing == "م") {
                    engTiming = "PM";
                } else if (timing == "ص") {
                    engTiming = "AM";
                }

                var newFormattedStartDate = month + "/" + day + "/" + year + " " + time + " " + engTiming;
                var eveStartDateWithTime = new Date(newFormattedStartDate);
                var eveStartDateWithoutTime = new Date(eveStartDateWithTime.getFullYear(), eveStartDateWithTime.getMonth(), eveStartDateWithTime.getDate());


                var splittedDate2 = currentArabicEndDate.split("/");
                var day2 = splittedDate2[0];
                var month2 = splittedDate2[1];
                var amOrPm2 = splittedDate2[2].split(" ");
                var year2 = amOrPm2[0];
                var time2 = amOrPm2[1];
                var timing2 = amOrPm2[2];
                var engTiming2 = "";
                if (timing2 == "م") {
                    engTiming2 = "PM";
                } else if (timing2 == "ص") {
                    engTiming2 = "AM";
                }

                var eveStartDateWithTime = new Date($(".event-checkStartDate").text());
                var eveStartDateWithoutTime = new Date(eveStartDateWithTime.getFullYear(), eveStartDateWithTime.getMonth(), eveStartDateWithTime.getDate());

                var eveEndDateWithTime = new Date($(".event-checkEndDate").text());
                var eveEndDateWithoutTime = new Date(eveEndDateWithTime.getFullYear(), eveEndDateWithTime.getMonth(), eveEndDateWithTime.getDate());


                var nowDateWithTime = new Date();
                var nowDateWithoutTime = new Date(nowDateWithTime.getFullYear(), nowDateWithTime.getMonth(), nowDateWithTime.getDate());

                if (eveStartDateWithoutTime > nowDateWithoutTime) {
                    $(".eventDateStatus").text("القادم");
                } else if (eveStartDateWithoutTime < nowDateWithoutTime && eveEndDateWithoutTime >= nowDateWithoutTime) {
                    $(".eventDateStatus").text("جارى");
                } else if (eveStartDateWithoutTime.getTime() == nowDateWithoutTime.getTime() && eveEndDateWithoutTime > nowDateWithoutTime) {
                    $(".eventDateStatus").text("جارى");
                } else if (eveStartDateWithoutTime.getTime() == nowDateWithoutTime.getTime() && eveEndDateWithoutTime.getTime() == nowDateWithoutTime.getTime()) {
                    $(".eventDateStatus").text("اليوم");
                }
                else {
                    $(".eventDateStatus").text("السابق");
                }

            }

        } else {

            var eveStartDateWithTime = new Date($(".event-checkStartDate").text());
            var eveStartDateWithoutTime = new Date(eveStartDateWithTime.getFullYear(), eveStartDateWithTime.getMonth(), eveStartDateWithTime.getDate());

            var eveEndDateWithTime = new Date($(".event-checkEndDate").text());
            var eveEndDateWithoutTime = new Date(eveEndDateWithTime.getFullYear(), eveEndDateWithTime.getMonth(), eveEndDateWithTime.getDate());


            var nowDateWithTime = new Date();
            var nowDateWithoutTime = new Date(nowDateWithTime.getFullYear(), nowDateWithTime.getMonth(), nowDateWithTime.getDate());


            if (eveStartDateWithoutTime > nowDateWithoutTime) {

                $(".eventDateStatus").text("UPCOMING");

            } else if (eveStartDateWithoutTime < nowDateWithoutTime && eveEndDateWithoutTime >= nowDateWithoutTime) {
                $(".eventDateStatus").text("ONGOING");

            } else if (eveStartDateWithoutTime.getTime() == nowDateWithoutTime.getTime() && eveEndDateWithoutTime > nowDateWithoutTime) {
                $(".eventDateStatus").text("ONGOING");

            } else if (eveStartDateWithoutTime.getTime() == nowDateWithoutTime.getTime() && eveEndDateWithoutTime.getTime() == nowDateWithoutTime.getTime()) {
                $(".eventDateStatus").text("TODAY");

            } else {
                $(".eventDateStatus").text("PAST");
            }
        }

    })

});