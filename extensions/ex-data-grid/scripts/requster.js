







$(document).ready(function() {
  var skip = 0;
  /* fill the dropdown menu */
  // $("#hsCriteria").append(new Option("Description", "desc"));
  // $("#hsCriteria").append(new Option("Code", "code"));
  $("#codeName").keyup(function (e) {
    if (e.which == 13) {
      $('#getCodes').trigger('click');
    }
  });
  $("#getCodes").click(function() {
    skip = 10;
    var codeName = $("#codeName").val();
    var Criteria = $("#hsCriteria").val();
    var hsBody = {
      GetHarmCodeList: {
        Section: "",
        Chapter: "",
        HSDesc: Criteria=="desc"?codeName:"",
        HSCode: Criteria=="desc"?"":codeName,
        UoMCode: "",
        Percentage: "5",
        Skip: 0,
        Take: 10
      }
    };
    $.when(getHSCodes(codeName, hsBody))
      .done(function(data) {
		  data = JSON.parse(data);
        if (data && data.GetHarmCodeListResponse && data.GetHarmCodeListResponse.GetHarmCodeListResult.Total) {
        $(".table-responsive").show();
		$("#no-data").hide();
		$("#error-msg").hide();
		$("#totalResults").show();
          var totalResults = data.GetHarmCodeListResponse.GetHarmCodeListResult.Total;
          var codes = data.GetHarmCodeListResponse.GetHarmCodeListResult.HSData.HSDetails;
          var displayedResults = 0;
		  if($.isArray(data.GetHarmCodeListResponse.GetHarmCodeListResult.HSData.HSDetails))
          {
          	 displayedResults = codes.length;
          }
          else
          {
          	 displayedResults = 1;
          }
		  
		  if($.checkSiteRTLDirection())
		  {
			  $("#totalResults").html(
            "عرض " + displayedResults + " من " + totalResults + " نتيجة"
          );
		  }
		  else
		  {
			  $("#totalResults").html(
            "Displaying " + displayedResults + " of " + totalResults + " Results"
          );
		  }
		  
		  
          var html = drawGrid(codes);
          $("#codeResults").html(html.join(""));
          skip < totalResults
            ? $(".grid-load-more").show()
            : $(".grid-load-more").hide();
        } else {
          $(".grid-load-more").hide();
          $(".table-responsive").hide();
          $("#totalResults").hide();
		  $("#error-msg").hide();		  
          $("#no-data").show();
        }
      })
      .fail(function(data) {
        $(".grid-load-more").hide();
        $(".table-responsive").hide();
        $("#totalResults").hide();
		$("#no-data").hide();
        $("#error-msg").show();
        console.log("error:" + data);
      });
  });
  $("#loadmoreCodes").click(function() {
	  var codeName = $("#codeName").val();
    var Criteria = $("#hsCriteria").val();
    var hsBody = {
      GetHarmCodeList: {
        Section: "",
        Chapter: "",
        HSDesc: Criteria=="desc"?codeName:"",
        HSCode: Criteria=="desc"?"":codeName,
        UoMCode: "",
        Percentage: "5",
        Skip: skip,
        Take: 10
      }
    };
    $.when(getHSCodes(codeName, hsBody))
      .done(function(data) {
		  data = JSON.parse(data);
        var codes = data.GetHarmCodeListResponse.GetHarmCodeListResult.HSData.HSDetails;
        var totalResults = data.GetHarmCodeListResponse.GetHarmCodeListResult.Total;
		var displayedResults = 0;
		if($.isArray(data.GetHarmCodeListResponse.GetHarmCodeListResult.HSData.HSDetails))
          {
          	 displayedResults = skip + codes.length;
          }
          else
          {
          	 displayedResults = 1;
          }
		  if($.checkSiteRTLDirection())
		  {
			  $("#totalResults").html(
            "عرض " + displayedResults + " من " + totalResults + " نتيجة"
          );
		  }
		  else
		  {
			  $("#totalResults").html(
            "Displaying " + displayedResults + " of " + totalResults + " Results"
          );
		  }
        var html = drawGrid(codes);
        $("#codeResults").append(html.join(""));
        skip += 10;
		 skip < totalResults
          ? $(".grid-load-more").show()
          : $(".grid-load-more").hide();
      })
      .fail(function(data) {
        $(".grid-load-more").hide();
        $(".table-responsive").hide();
        $(".grid-load-more").hide();
        $("#totalResults").hide();
        $("#error-msg").show();
        console.log("error:" + data);
      });
  });
  function drawGrid(data) {
    var initializer = "[data-grid]";
    var instances = $(initializer);
    var columnsData = [];
    instances.each(function(idx, instance) {
      if ($(instance).data("grid") || $(instance).data("grid") == "") {
        var columns = instance.children[0].children;
        $.each(columns, function(idx, col) {
          var className = col.className;
          var dataName = col.dataset ? col.dataset.field : "";
          columnsData.push({ className: className, fieldToMap: dataName });
        });
      }
    });
    var html = [];
	if($.isArray(data))
	{
	  for (var i in data) {
      var row = data[i];
      html.push('<tr class="d-flex">');
      $.each(columnsData, function(idx, column) {
        var fielToMap = findProberty(column.fieldToMap, row);
        html.push(
          '<td class="' + column.className + '">' + fielToMap + "</td>"
        );
      });
      html.push('</tr> <hr class="hr-1 w-100" />');
    }
	}
	else
	{
	  var row = data;
      html.push('<tr class="d-flex">');
      $.each(columnsData, function(idx, column) {
        var fielToMap = findProberty(column.fieldToMap, row);
        html.push(
          '<td class="' + column.className + '">' + fielToMap + "</td>"
        );
      });
      html.push('</tr> <hr class="hr-1 w-100" />');
	}
	
   
    return html;
  }
  function findProberty(propertyName, object) {
    var rtl = $.checkSiteRTLDirection();
    var langTry = rtl ? "Ar" : "En";
    var prop =
      object[propertyName] ||
      object[propertyName + langTry] ||
      object[propertyName + langTry.toLocaleLowerCase()] ||
	  object[propertyName + langTry.toLocaleUpperCase()] ||
      "-";
    //valueOf
    return prop;
  }
  function getHSCodes(codeName, body) {
	  var hosturl = "https://" + $(location).attr('hostname');
    return $.ajax({
      url: hosturl+"/TradeADIntegration/GetHarmCodeList",
      type: "POST",
      async: false,
	  data: body,
      success: function(res) {},
      error: function(jqXHR, exception) {}
    });
  }
});
























// working example 
// $(document).ready(function() {
//   var from = 0;


//   /* fill the dropdown menu */
//   $("#hsCriteria").append(new Option("Description", "desc"));
//   $("#hsCriteria").append(new Option("Code", "code"));

//   $("#codeName").keyup(function (e) {
//     if (e.which == 13) {
//       $('#getCodes').trigger('click');
//     }
//   });

//   $("#getCodes").click(function() {
//     from = 0;
//     var codeName = $("#codeName").val();
//     var Criteria = $("#hsCriteria").val();
//     var hsBody = {
//       GetHarmCodeList: {
//         Section: "",
//         Chapter: "",
//         HSDesc: Criteria=="desc"?codeName:"",
//         HSCode: Criteria=="desc"?"":codeName,
//         UoMCode: "",
//         Percentage: "5",
//         Skip: from,
//         Take: 10
//       }
//     };
//     $.when(getHSCodes(codeName, from))
//       .done(function(data) {
//         if (data && data.results && data.results.length) {
//         $("#no-data").hide();
//         $(".table-responsive").show();
//           var totalResults = data.total_results;
//           var codes = data.results;

//           $("#totalResults").html(
//             "Displaying " + (from+data.results.length) + " of " + totalResults + " Results"
//           );

//           var html = drawGrid(codes);
//           $("#codeResults").html(html.join(""));

//           from < totalResults
//             ? $(".grid-load-more").show()
//             : $(".grid-load-more").hide();
//         } else {
//           $(".grid-load-more").hide();
//           $(".table-responsive").hide();
//           $("#totalResults").hide();
//           $("#no-data").show();
//         }
//       })
//       .fail(function(data) {
//         $(".grid-load-more").hide();
//         $(".table-responsive").hide();
//         $("#totalResults").hide();
//         $("#error-msg").show();
//         console.log("error:" + data);
//       });
//   });

//   $("#loadmoreCodes").click(function() {
//     var codeName = $("#codeName").val();
//     var Criteria = $("#hsCriteria").val();

//     var hsBody = {
//       GetHarmCodeList: {
//         Section: "",
//         Chapter: "",
//         HSDesc: Criteria=="desc"?codeName:"",
//         HSCode: Criteria=="desc"?"":codeName,
//         UoMCode: "",
//         Percentage: "5",
//         Skip: from,
//         Take: 10
//       }
//     };
//     $.when(getHSCodes(codeName, from))
//       .done(function(data) {
//         var codes = data.results;
//         var totalResults = data.total_results;

//         from < totalResults
//           ? $(".grid-load-more").show()
//           : $(".grid-load-more").hide();

//         var html = drawGrid(codes);
//         $("#codeResults").append(html.join(""));
//         from += 1;
//       })
//       .fail(function(data) {
//         $(".table-responsive").hide();
//         $(".grid-load-more").hide();
//         $("#totalResults").hide();
//         $("#error-msg").show();
//         console.log("error:" + data);
//       });
//   });

//   function drawGrid(data) {
//     var initializer = "[data-grid]";
//     var instances = $(initializer);
//     var columnsData = [];
//     instances.each(function(idx, instance) {
//       if ($(instance).data("grid") || $(instance).data("grid") == "") {
//         var columns = instance.children[0].children;
//         $.each(columns, function(idx, col) {
//           var className = col.className;
//           var dataName = col.dataset ? col.dataset.field : "";
//           columnsData.push({ className: className, fieldToMap: dataName });
//         });
//       }
//     });

//     var html = [];
//     for (var i in data) {
//       var row = data[i];
//       html.push('<tr class="d-flex">');
//       $.each(columnsData, function(idx, column) {
//         var fielToMap = findProberty(column.fieldToMap, row);
//         html.push(
//           '<td class="' + column.className + '">' + fielToMap + "</td>"
//         );
//       });
//       html.push('</tr> <hr class="hr-1 w-100" />');
//     }

//     return html;
//   }

//   function findProberty(propertyName, object) {
//     var rtl = $.checkSiteRTLDirection();
//     var langTry = rtl ? "Ar" : "En";

//     var prop =
//       object[propertyName] ||
//       object[propertyName + langTry] ||
//       object[propertyName + langTry.toLocaleLowerCase()] ||
//       "-";
//     //valueOf

//     return prop;
//   }

// });

// function getHSCodes(codeName, from) {
//   return $.ajax({
//     url:
//       " https://api.themoviedb.org/3/search/movie?api_key=4cb1eeab94f45affe2536f2c684a5c9e&query=" +
//       codeName+"&page="+from+1+"&lang=en",
//     type: "GET",
//     async: false,
//     success: function(res) {},
//     error: function(jqXHR, exception) {}
//   });
// }