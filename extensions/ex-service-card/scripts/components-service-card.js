/***************************************************************************************************
Extension Name: \\ex-service-card
File: component-service-card
Owner: null
Version: 1.0.0
***************************************************************************************************/
$(document).ready(function () {

    let selector = ".ex-service-card"
    var lang = $("html").attr("lang"),
    servicePath = $.getQueryString("serviceUrl")
    var servicecardrecache = $("#servicecardrecache").length ? $("#servicecardrecache").val() : true ;
    $(selector).each(function(){
        let serviceCard  = this,
        url = "/SCAPI/ServiceCard/GetServiceCard"; 
        $.ajax({
            url: url,
            async: true,
            crossDomain: true,
            method: "POST",
            processData: false,
            headers: {
                "content-type": "application/json",
                "cache-control": "no-cache"
            },
            data: JSON.stringify({
                "servicePath": decodeURIComponent(servicePath), //"benefits-for-emiratis/Scholarships and University Expenses/Scholarships/RequestforaScholarship",
                "lang": lang,
                "recache": servicecardrecache
            }),
            success: function(res) {
                if(res.success){
                    $(serviceCard).append(res.ServiceCardHtml);
                }else {
                    // should place error
                    $(serviceCard).append("<div> </div>");
                }
            },
            error: function(jqXHR, exception) {
                
            }
        });

    });

});