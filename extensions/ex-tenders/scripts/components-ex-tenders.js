/***************************************************************************************************
Extension Name: \\ex-tenders
File: component-ex-tenders
Owner: ahmed tawfik
Version: 1.0.0
***************************************************************************************************/


if ($(".ex-tenders").length) {

    let Tenders = (function () {

        let pageSize = 3,
            loadmoreSize = 0,
            response_totalCount = null;
        let istenderDesktop = true;
        let tenderList_startIndex = 0,
            tenderListcount = 0,
            tenderList_limit = 10;
            
        //let enviromonetQA="/almaqtaa";
        let enviromonetQA = "";
        let filter_DueDate = "",
            filter_Sorting = "LAST_CREATED",
            filter_Name = "";
        let InternalStatus = "OPEN";
        let TenderName = "";
        let tenderTotalCount = null;
        let clickedIndex = 0;
        const monthNamesEn = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const monthNamesAr = ["يناير", "فبراير", "مارس", "إبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
        let locationAPI = window.location.origin;
        //let locationAPI = "https://portalqa.elab.abudhabi.ae/";
        let locationAPIListing = locationAPI + "/SCAPI/ADGEs/AlMaqtaa/Tender/List";
        //locationAPIListing = "https://tammdevcm1.tamm.abudhabi/SCAPI/ADGEs/AlMaqtaa/Tender/List";
        let locationAPIDetails = locationAPI + "/SCAPI/ADGEs/AlMaqtaa/Tender/Details/";
        //locationAPIDetails = "https://tammdevcm1.tamm.abudhabi/SCAPI/ADGEs/AlMaqtaa/Tender/Details";
        //let lookupArray = JSON.parse('[{"Key":"Button_Download","Value":"Download"},{"Key":"Button_getUpdates","Value":"Get updates on this tender"},{"Key":"Button_Participate","Value":"Participate Now"},{"Key":"Button_Print","Value":"Print"},{"Key":"Button_Share","Value":"Share"},{"Key":"Button_Subscribe","Value":"Subscribe"},{"Key":"Field_Bidding_Date","Value":"BIDDING OPENS ON"},{"Key":"Field_Category","Value":"CATEGORY"},{"Key":"Field_Due_Date","Value":"DUE ON"},{"Key":"Field_Estimated_Value","Value":"Estimated Value"},{"Key":"Field_Event_Type","Value":"Event Type"},{"Key":"Filter_All","Value":"All"},{"Key":"Filter_Category_Label","Value":"CATEGORY"},{"Key":"Filter_Clear_All","Value":"Clear All"},{"Key":"CLOSE_AFT_30D","Value":"Closing after 30 Days"},{"Key":"CLOSE_IN_15D","Value":"Closing in 15 Days"},{"Key":"CLOSE_IN_30D","Value":"Closing in 30 Days"},{"Key":"CLOSE_IN_5D","Value":"Closing in 5 Days"},{"Key":"Filter_Complete_Tenders","Value":"Completed Tenders"},{"Key":"Filter_DueDate_Label","Value":"DUE DATE"},{"Key":"Filter_Entities_Label","Value":"ENTITIES"},{"Key":"Filter_Open_Tenders","Value":"Open Tenders"},{"Key":"Filter_Show_More","Value":"Show More"},{"Key":"COMPL","Value":"COMPLETED"},{"Key":"OPEN","Value":"OPEN"},{"Key":"Label_downloads_title","Value":"Downloads"},{"Key":"Label_Load_More","Value":"LOAD MORE"},{"Key":"Label_Search","Value":"SEARCH"},{"Key":"Placeholder_Search","Value":"Aa"}]')
        let lookupArray = JSON.parse(document.Lookups);
        let loadingHTML = '<div class="ex-loader d-flex justify-content-center align-items-top  position-relative py-3 bg-transparent" data-animation-type="sync" data-animation-duration="200" data-svg-url="" style="z-index: 1;"><div class="ex-loader__loader "><span></span><span></span></div></div>';
        let filtersPayload = {
            "filtersLists": [
                {
                    "URL": "/SCAPI/ADGEs/AlMaqtaa/Tender/Categories",
                    "Limit": " ",
                    "Type": "get",
                    "ClassList": ".listCategories",
                    "enName": "NameEn",
                    "arName": "NameAr",
                    "idName": "ID",
                    "selected": []
                },
                {
                    "URL": "/SCAPI/ADGEs/AlMaqtaa/Tender/Entities",
                    "Limit": " ",
                    "Type": "get",
                    "ClassList": ".listEntities",
                    "enName": "EntityName",
                    "arName": "EntityName",
                    "idName": "EntityId",
                    "selected": []
                }
            ]
        };
        //on page start init calls
        let init = function () {
            if ($(window).width() < 1100) {
                istenderDesktop = false;
            }
            //init filters
            dueDateFilters();
            sortingFilters();


            getFilterList(filtersPayload);
            let payload = {}
            calltenderPayload()
            //fire on click for load more 
            $("#load-more-tender").unbind().click(function () {
                calltenderPayload()
            })
            //status navigation init (compl/opened)
            navfilterInit();
            //search box init
            searchtenderCallListing();
            //custom clear for search and due date
            clearCustoms();
            resetLangSwitcher();
        },
            //function to return path name for file to download
            filePathRender = function filePathRender(fileID, fileName, fileEventID) {
                _fileHTML_fileId = encodeURIComponent(fileID),
                    _fileHTML_fileName = fileName,
                    _fileHTML_eventID = fileEventID;
                _fileHTML_ = ""
                if (_fileHTML_fileId && _fileHTML_fileName && _fileHTML_eventID) {
                    _fileHTML_ = locationAPI + '/SCAPI/ADGEs/AlMaqtaa/Tender/files/Download.ashx?fileid=' + _fileHTML_fileName + '&filename=' + _fileHTML_fileId + '&eventId=' + _fileHTML_eventID + '&documentType=tender';
                }
                return _fileHTML_
            },
            //function  to call ajax for listing, take payload object which contains the status
            tenderCallListing = function (payload) {
                //get the list
                //let tenderList_limit;
                let locationsearchSTR=decodeURIComponent(window.location.search)
                // endIndex ? tenderList_limit = endIndex : tenderList_limit = pageSize;
                if (-1 == locationsearchSTR.substring(4).indexOf("?recommendedLimit=3") && !(locationsearchSTR.length > 10)) {
                    $.ajax({
                        url: locationAPIListing,
                        type: "Post",
                        data: payload,
                        beforeSend: function () {
                            $("#loaderDiv").html(loadingHTML);
                            $("#loaderDiv").show();
                        },
                        success: function (data) {
                            tenderTotalCount = data.TenderCount;
                            if (tenderList_startIndex == 0) {
                                $(".ex-tenders--listing").html(" ");
                                clickedIndex = 0;
                            }
                            if (data.TenderList) {

                                $("#loaderDiv").hide();
                                $("#call-error").hide();
                                $("#no-result").hide();
                                $("#no-listing-result").hide();
                                for (i = 0; i < tenderList_limit; i++) {
                                    if (data.TenderList[i]) {
                                        $(".ex-tenders--listing").append(tenderListHead(data.TenderList[i]))
                                    }
                                }
                                tenderListcount = $(".ex-tenders--listing .ex-tender").length;
                                tenderLoadmore(tenderTotalCount);
                                tenderAccordion();

                            } else {

                                $("#loaderDiv").hide();
                                $("#call-error").hide();
                                if ($("#tender-search input").val().trim()) {
                                    $("#no-listing-result").hide();
                                    $("#no-result").show()
                                    $(".key-searched").text($("#tender-search input").val())
                                } else {
                                    $("#no-listing-result").show();
                                    $("#no-result").hide()
                                }

                                tenderLoadmore(0);
                            }
                            truncateElements();
                        },
                        error: function (errorThrown) {
                            $("#loaderDiv").hide();
                            $("#call-error").show();
                            tenderLoadmore(0)
                            $(".ex-tenders--listing").html("")
                        }

                    });
                } else if ((-1 == locationsearchSTR.substring(4).indexOf("?recommendedLimit=3")) && locationsearchSTR.length > 10 && locationsearchSTR.indexOf("%3") == -1) {
                    setHomeFilters();
                }
                else {
                    let winLocationSearch = window.location.search;
                    let win_extractedID = "";
                    if (winLocationSearch.indexOf("%3") != -1) {
                        win_extractedID = winLocationSearch.substring((winLocationSearch.indexOf("=") + 1), (winLocationSearch.indexOf("%3")))
                    } else {
                        win_extractedID = winLocationSearch.substring((winLocationSearch.indexOf("=") + 1), (winLocationSearch.indexOf("?recommendedLimit")))
                    }
                    //let queryString = window.location.search.substring(4);
                    searchRelatedTender(win_extractedID)
                    //to clear url after search
                    history.pushState({}, null, "?");
                    clickedIndex = 0;
                    tenderAccordion();

                }
                //add accordion event

            },
            //function when filters passed from home to tender listing page
            setHomeFilters = function setHomeFilters() {
                let locationsearchSTR=decodeURIComponent(window.location.search)
                let categoriesQuerySTRArray = locationsearchSTR.substring(locationsearchSTR.indexOf("=") + 1, locationsearchSTR.indexOf("&")).split(",");
                let dueQuerySTRArray = locationsearchSTR.substring(locationsearchSTR.indexOf("=", locationsearchSTR.indexOf("=") + 1) + 1, locationsearchSTR.length);
                let dueSortingType = "LAST_CREATED";
                //clear URL
                history.pushState({}, null, "?");
                filtersPayload.filtersLists[0].selected = categoriesQuerySTRArray;
                $.each(filtersPayload.filtersLists, function (j, value) {
                    if (filtersPayload.filtersLists[j].ClassList == ".listCategories") { selectArrayofSelected(value); }
                });

                filter_DueDate = dueQuerySTRArray;
                filter_Sorting = dueSortingType;
                $('.sortingFilters option[value="LAST_CREATED"]').prop('selected', true)
                tenderList_startIndex=0;



                if (filter_DueDate == "all" || filter_DueDate == "ALL") {
                    filter_DueDate = "";
                    $("#CLOSE_IN_0D").prop("checked", true)
                } else {
                    filter_DueDate = filter_DueDate
                    $("#"+filter_DueDate).prop("checked", true)
                }
                if (categoriesQuerySTRArray[0] == "SelectAll") {
                    tenderCallListing({
                        "status": $(".nav-filter a.active").data().tenderfilter,
                        "offset": tenderList_startIndex,
                        "limit": tenderList_limit,
                        "Category": "",
                        "Entity": filtersPayload.filtersLists[1].selected.toString(),
                        "Sorting": filter_Sorting,
                        "DueDate": filter_DueDate,
                        "Name": filter_Name
                    });
                } else {


                    calltenderPayload();
                }
                clickedIndex = 0;
                tenderAccordion();
                tenderLoadmore();


            },
            //function for collapse and expand per tender
            tenderAccordion = function () {


                $('.ex-tender-head').unbind().click(function () {
                    let _this = $(this);

                    $(".ex-tender-head").each(function () {

                        if ($(this).data().tenderid != _this.data().tenderid) {
                            //collapse all tenders
                            //$(this).parent().find(".ex-tender-body").slideUp(400)
                            //$(this).parent().removeClass("section")
                            //$(this).parent().removeClass("sectionLoadedTender")
                            //$(this).parent().find(".headIcon").removeClass("active")
                        }

                    })
                    if (_this.parent().hasClass("sectionLoadedTender") && _this.parent().hasClass("section")) {
                        //if it's expanded already so just collapse and don't load content again
                        _this.parent().find(".ex-tender-body").slideToggle(400)
                        _this.parent().find(".headIcon").toggleClass("active")
                    } else if (!(_this.parent().hasClass("sectionLoadedTender") && _this.parent().hasClass("section"))) {
                        //activate the pressed tender
                        _this.parent().addClass("section");
                        _this.parent().addClass("sectionLoadedTender");

                        tenderCallDetails(_this.data().tenderid)
                        _this.parent().find(".ex-tender-body").slideDown(400, function () {
                            _this = _this.parent();
                            truncateElements();
                        });
                        _this.parent().find(".headIcon").addClass("active")
                    }

                });

            },
            //function for tender item heading
            tenderListHead = function () {
                let tender = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

                let tenderEntityName = "";
                if (tender.EntityName) {
                    tenderEntityName = tender.EntityName;
                }
                let tenderNumber = "";
                if (tender.TenderNumber) {
                    tenderNumber = tender.TenderNumber;
                }

                //closing in zero days
                let DueDays = "";
                if ((!tender.DueDays) || tender.DueDays > 0) {
                    if (tender.DueDays == 0) {
                        DueDays = lookupDictionary("Label_Closing_In") + tender.DueDays + " " + lookupDictionary("Label_Days");
                    } else if (tender.DueDays && tender.DueDays != -1) {
                        DueDays = lookupDictionary("Label_Closing_In") + tender.DueDays + " " + lookupDictionary("Label_Days");
                    } else if (tender.DueDays > 0) {
                        DueDays = lookupDictionary("Label_Closing_In") + tender.DueDays + " " + lookupDictionary("Label_Days");
                    }
                }


                let tenderListHtml = '<div class=" ex-tender d-flex flex-column border rounded   p-4 mt-4">' +
                    '<div class="ex-tender-head  position-relative" data-tenderid=' + (tender.TenderID) + '>' +
                    '<span class="headIcon icon-arrow-small-right"></span>' +
                    (tenderNumber && '<p class="doc-number small-text font-weight-boldest">' + tenderNumber + '</p>') +
                    (tender.TenderName && '<h4 class="py-2 pr-lg-6 pr-md-0 pr-sm-0">' + tender.TenderName + '</h4>') +
                    '<p class="badge d-flex p-0 flex-wrap  ">' +
                    (tenderEntityName && '<span class=" mr-2 mb-2">' + tenderEntityName + '</span>') +
                    (DueDays && '<span class="active mr-2 mb-2 hide-print">' + DueDays + '</span>') +
                    ' </p> </div><div class="ex-tender-body"> </div></div>';
                return tenderListHtml;
            },
            //function for tender item body
            tenderCallDetails = function (tenderDetailsID) {

                $.ajax({
                    url: (locationAPIDetails + "/" + tenderDetailsID + "?recommendedLimit=3"),
                    type: "GET",
                    beforeSend: function () {
                        $(".ex-tender-head[data-tenderid='" + tenderDetailsID + "']").parent().find(".ex-tender-body").html(loadingHTML)
                    },
                    success: function (data) {
                        if (data.TenderDetails) {
                            tenderListBody(tenderDetailsID, data)
                        }
                    },
                    error: function (errorThrown) {

                    },
                    complete: function () {
                        $(".truncate").each(function () {
                            $(this).truncate();
                        })
                    }
                });
            },
            //function to detect language
            //you path to it arabic element and english element
            //it returns the correct element based on language
            detectLanguage = function (elementAr, elementEn) {
                let element = "";
                ($('html[lang="ar-AE"]').length) ? element = elementAr : element = elementEn;


                return element;
            },
            //function to truncate elements based on class
            truncateElements = function truncateElements() {
                setTimeout(function () {
                    $(".truncate").each(function () {
                        $(this).truncate();
                    })
                }, 450);
            },
            //function to render the body of each tender item
            tenderListBody = function (tenderdetailsID, TenderDetailsObj) {

                $(".ex-tender-head[data-tenderid='" + tenderdetailsID + "']").parent().find(".ex-tender-body").html("")

                let UTC_BiddingOpenDate = new Date(TenderDetailsObj.TenderDetails.BiddingOpenDate);
                let monthElementBid = detectLanguage(monthNamesAr[UTC_BiddingOpenDate.getMonth()], monthNamesEn[UTC_BiddingOpenDate.getMonth()])
                let UTC_DueDate = new Date(TenderDetailsObj.TenderDetails.DueDate);
                let monthElementDue = detectLanguage(monthNamesAr[UTC_DueDate.getMonth()], monthNamesEn[UTC_DueDate.getMonth()])

                let bidDate = UTC_BiddingOpenDate.getDate() + " " + monthElementBid + " " + UTC_BiddingOpenDate.getFullYear();
                let dueDate = UTC_DueDate.getDate() + " " + monthElementDue + " " + UTC_DueDate.getFullYear();

                //category based on language 
                let categoryDescription = detectLanguage(TenderDetailsObj.TenderDetails.CategoryDescriptionAr, TenderDetailsObj.TenderDetails.CategoryDescriptionEn)

                let TenderDetailsAttachments = "";
                if (TenderDetailsObj.TenderDetails.Attachments.length) {
                    TenderDetailsAttachments = TenderDetailsObj.TenderDetails.Attachments;
                }
                let tenderEventType = "";
                if (TenderDetailsObj.TenderDetails.EventType) {
                    tenderEventType = TenderDetailsObj.TenderDetails.EventType;
                }

                let EstimatedValue = "";
                if (TenderDetailsObj.TenderDetails.EstimatedValue) {
                    EstimatedValue = TenderDetailsObj.TenderDetails.EstimatedValue;
                }
                let _TenderDetails = ""
                if (TenderDetailsObj.TenderDetails.TenderDetails) {
                    _TenderDetails = TenderDetailsObj.TenderDetails.TenderDetails.replace(/(<([^>]+)>)/ig, "");
                }
                let categoryTitle = lookupDictionary("Field_Category");
                let biddateTitle = lookupDictionary("Field_Bidding_Date");
                let duedateTitle = lookupDictionary("Field_Due_Date");
                let downloadsTitle = lookupDictionary("Label_downloads_title");
                let getUpdatesTitle = lookupDictionary("Button_getUpdates");
                let shareTitle = lookupDictionary("Button_Share");
                let printTitle = lookupDictionary("Button_print");

                let getUpdatesLNK = locationAPI + enviromonetQA + "/for-suppliers/public-tenders/Get-updates-on-this-tender?tenderid=" + tenderdetailsID;

                //Participate button logic
                //if no value returned show Coming Soon Message
                //if internal status is completed show view more button
                //else show participate button
                let tenderDiscoveryUrl = "";
                if (TenderDetailsObj.TenderDetails.DiscoveryUrl) {
                    tenderDiscoveryUrl = TenderDetailsObj.TenderDetails.DiscoveryUrl;
                } else {
                    tenderDiscoveryUrl = "javascript: void(0)";
                }
                let _actionButton = "";
                let buttonParticipateTitle = lookupDictionary("Button_Participate");
                let buttonviewmoreTitle = lookupDictionary("Button_viewmore");
                let buttonComingSoonTitle = lookupDictionary("Button_ComingSoon");
                if (tenderDiscoveryUrl != "javascript: void(0)") {
                    if (TenderDetailsObj.TenderDetails.InternalStatus == "COMPL") {
                        _actionButton = buttonviewmoreTitle;
                    } else {
                        _actionButton = buttonParticipateTitle;
                    }
                }else {
                    _actionButton = buttonComingSoonTitle;
                }

                if( ! (TenderDetailsObj.TenderDetails.EntityName)){
                    _actionButton = buttonComingSoonTitle;
                    tenderDiscoveryUrl = "javascript: void(0)";
                } 

                let eventTypeTitle = lookupDictionary("Field_Event_Type");
                let estimatedValueTitle = lookupDictionary("Field_Estimated_Value");
                let recommendedTendersTitle = lookupDictionary("Label_recommended_tenders");

                let isThereRecommendedTender = "";
                if (TenderDetailsObj.TenderDetails.RecommendedTenders[0]) {
                    isThereRecommendedTender = TenderDetailsObj.TenderDetails.RecommendedTenders[0]
                }

                let tenderShareEmail = 'mailto:?subject=' + encodeURIComponent('Tender: ') + encodeURIComponent(TenderDetailsObj.TenderDetails.TenderName) + '&body=' + encodeURIComponent(window.location.origin + window.location.pathname) + encodeURIComponent("?id=") + encodeURIComponent(tenderdetailsID) + encodeURIComponent('?recommendedLimit=3');
                let tenderBodyHtml = '<hr class="my-4">' +
                    (_TenderDetails && '<p class="mb-4">' + _TenderDetails + '</p>') +
                    '   <div class="row print-row">' +
                    (categoryDescription && '      <div class="col-12 col-md-12 col-lg-4 mt-lg-4 mt-md-2 mt-sm-2 print-row">') +
                    (categoryDescription && '         <span class="caption  text-black-50 text-uppercase"> ' + categoryTitle + ': </span> ') +
                    (categoryDescription && '<p class="mt-2 font-weight-boldest print-row">' + categoryDescription + '</p>') +
                    (categoryDescription && '      </div>') +
                    (bidDate && '      <div class="col-12 col-md-12 col-lg-4 mt-lg-4 mt-md-2 mt-sm-2 print-row">') +
                    (bidDate && '<span class="small-text text-black-50 text-uppercase "> ' + biddateTitle + ': </span> ') +
                    (bidDate && '<p class="mt-2 font-weight-boldest print-row">' + bidDate + '</p>') +
                    (bidDate && '      </div>') +
                    (dueDate && '      <div class="col-12 col-md-12 col-lg-4 mt-lg-4 mt-md-2 mt-sm-2 print-row">') +
                    (dueDate && '         <span class="small-text text-black-50 text-uppercase "> ' + duedateTitle + ': </span> ') +
                    (dueDate && '<p class="mt-2 font-weight-boldest print-row">' + dueDate + '</p>') +
                    (dueDate && '      </div>') +
                    '   </div>' +
                    (TenderDetailsAttachments && '   <h4 class="py-4  hide-print"">' + downloadsTitle + '</h4>') +
                    '   <div class="row tenderdownloads  hide-print"">' +

                    '   </div>' +
                    '   <hr class=" hide-print">' +
                    '   <div class="row my-4">' +
                    '      <div class="col-lg-6 col-md-12  hide-print mb-lg-0 mb-md-3 mb-sm-3">' +
                    '         <a href="' + getUpdatesLNK + '" class="link-default font-weight-bold">' + getUpdatesTitle + ' <img class="mx-3" src="' + locationAPI + '/almaqta/-/media/Project/AlMaqtaa/AlMaqtaa/Tender/tenderIcon/email-update">' + '</a>' +
                    '      </div>' +
                    '      <div class="col-lg-6 col-md-12   print-row"><div class="row"><div class="col-lg-4"></div>' +
                    (tenderShareEmail && '<div class="col-lg-4 col-md-12  mb-lg-0 mb-md-3 mb-sm-3 align-items-lg-end d-flex flex-lg-column"><a href="' + tenderShareEmail + '" class="link-default font-weight-bold  hide-print d-lg-flex flex-lg-nowrap">' + shareTitle + ' <img class="mx-3" src="' + locationAPI + '/almaqta/-/media/Project/AlMaqtaa/AlMaqtaa/Tender/tenderIcon/share">' + '</a></div>') +
                    '         <div class=" col-lg-4 col-md-12 align-items-lg-end d-flex flex-lg-column"><p class="font-weight-bold hide-print d-lg-flex flex-lg-nowrap" style="cursor: pointer;" onclick="window.print()">' +
                    printTitle +
                    ' <img class="mx-3" src="' + locationAPI + '/almaqta/-/media/Project/AlMaqtaa/AlMaqtaa/Tender/tenderIcon/print">' +
                    '         </p></div>' +
                    '     </div> </div>' +
                    '   </div>' +
                    '   <div class="row">' +
                    '      <div class="col-md-12">' +
                    (tenderDiscoveryUrl && '       <div class="section--box d-flex flex-column flex-lg-row flex-md-column ppe-wrap  align-items-lg-center p-4  print-row print-0-spacing">') +
                    (tenderDiscoveryUrl && '<p class=" col-lg-3 hide-print mb-lg-0 mb-sm-3 participate-btn-wrap"><a ' + ((tenderDiscoveryUrl == "javascript: void(0)") && 'style=" cursor: default; pointer-events: none; "') + ((tenderDiscoveryUrl != "javascript: void(0)") && 'target="_blank"') + ' href="' + tenderDiscoveryUrl + '" class="button button--primary button--medium d-inline-flex align-items-center justify-content-center text-uppercase text-nowrap"  target="_blank">' + _actionButton + '</a></p>') +
                    (tenderEventType && '<p class="mx-lg-6 d-flex print-row  mb-lg-0 mb-sm-3 print-0-spacing event-type-wrap"> ' + ' <img class="mr-2  hide-print" src="' + locationAPI + '/almaqta/-/media/Project/AlMaqtaa/AlMaqtaa/Tender/tenderIcon/event type"><span>' + eventTypeTitle + ' <b class="font-weight-bold">' + tenderEventType + '</b></span></p>') +
                    (EstimatedValue && '<p class="mx-lg-6 d-flex print-row print-0-spacing estimate-value-wrap">' + ' <img class=" mr-2 hide-print" src="' + locationAPI + '/almaqta/-/media/Project/AlMaqtaa/AlMaqtaa/Tender/tenderIcon/estimated Value"><span>' + estimatedValueTitle + '  <b class="font-weight-bold">' + EstimatedValue + '</b></span></p>') +
                    (tenderDiscoveryUrl && '       </div>') +
                    '      </div>' +
                    '   </div>' +
                    (isThereRecommendedTender && '   <h4 class="mt-7 mb-4  hide-print">' + recommendedTendersTitle + '</h4>') +
                    '<div class="row recomendedtenders  hide-print">' +
                    '</div>';



                $(".ex-tender-head[data-tenderid='" + tenderdetailsID + "']").parent().find(".ex-tender-body").html(tenderBodyHtml)

                let downloadButtonSize = lookupDictionary("Label_downloads_size");
                let downloadButtonSizeByte = lookupDictionary("Label_downloads_size_byte");
                for (let key in TenderDetailsObj.TenderDetails.Attachments) {

                    let _docFileSize = TenderDetailsObj.TenderDetails.Attachments[key].filesize;
                    if (_docFileSize) {

                        if (_docFileSize < 1024) {
                            _docFileSize = _docFileSize + ' ' + downloadButtonSizeByte
                        } else {
                            _docFileSize = parseFloat(_docFileSize / 1024).toFixed(1) + ' ' + downloadButtonSize
                        }

                    }


                    let _fileName = TenderDetailsObj.TenderDetails.Attachments[key].filename;

                    let docIcon = '<img src="' + locationAPI + '/almaqta/-/media/Project/AlMaqtaa/AlMaqtaa/Tender/docIcons/Common file">';
                    if (_fileName.split('.').pop().toLowerCase() == "pdf") {
                        docIcon = '<img src="' + locationAPI + '/almaqta/-/media/Project/AlMaqtaa/AlMaqtaa/Tender/docIcons/PDF">';
                    } else if (_fileName.split('.').pop().toLowerCase() == "doc" || _fileName.split('.').pop().toLowerCase() == "docx") {
                        docIcon = '<img src="' + locationAPI + '/almaqta/-/media/Project/AlMaqtaa/AlMaqtaa/Tender/docIcons/DOC">';
                    } else if (_fileName.split('.').pop().toLowerCase() == "jpg" || _fileName.split('.').pop().toLowerCase() == "jpeg") {
                        docIcon = '<img src="' + locationAPI + '/almaqta/-/media/Project/AlMaqtaa/AlMaqtaa/Tender/docIcons/JPG">';
                    } else if (_fileName.split('.').pop().toLowerCase() == "ppt" || _fileName.split('.').pop().toLowerCase() == "pptx") {
                        docIcon = '<img src="' + locationAPI + '/almaqta/-/media/Project/AlMaqtaa/AlMaqtaa/Tender/docIcons/PPT">';
                    } else if (_fileName.split('.').pop().toLowerCase() == "png") {
                        docIcon = '<img src="' + locationAPI + '/almaqta/-/media/Project/AlMaqtaa/AlMaqtaa/Tender/docIcons/PNG">';
                    } else if (_fileName.split('.').pop().toLowerCase() == "xls" || _fileName.split('.').pop().toLowerCase() == "xlsx") {
                        docIcon = '<img src="' + locationAPI + '/almaqta/-/media/Project/AlMaqtaa/AlMaqtaa/Tender/docIcons/XLS">';
                    }

                    let downloadButtonTitle = lookupDictionary("Button_Download");

                    let fileHref = filePathRender(_fileName, TenderDetailsObj.TenderDetails.Attachments[key].fileId, TenderDetailsObj.TenderDetails.EventId)
                    let tenderDownloadHTML = '      <div class="col-md-6 col-sm-12">' +
                        '         <div class="d-flex flex-column h-100">' +
                        '            <div class="ex-icon-card ex-icon-card--border-less ex-icon-card--hover-effect ex-icon-card--border-hover mb-4 d-flex flex-column justify-content-between align-items-start p-4 position-relative rounded h-100">' +
                        '               <div class="ex-icon-card__wrapper w-100 d-flex flex-column flex-lg-row my-4">' +
                        '                  <div class="ex-icon-card__wrapper__content d-flex flex-column align-items-start justify-content-start">' +
                        '                     <div class="card-icon">' +
                        docIcon +
                        ' </div></div>' +
                        '                  <div class="ex-icon-card__wrapper d-flex flex-column align-items-start justify-content-center w-100 pt-lg-0 pt-md-2 pt-sm-3">' +
                        (_fileName && '<p class="m-0 w-100 truncate truncate-2 w-100 card-title--fixed-height font-weight-bold field-title">' + _fileName + '</p>') +
                        '                  </div>' +
                        '               </div>' +
                        '               <div class="ex-icon-card__wrapper d-flex flex-column w-100 align-items-start justify-content-start high-contrast--forced">' +
                        '                  <hr class="w-100 m-0 high-contrast--forced">' +
                        '                  <div class="ex-icon-card__wrapper__content d-flex align-items-start justify-content-between w-100 pt-4 high-contrast--forced">' +
                        '                     <div class="card-tag d-flex w-50"></div>' +
                        '                     <div class="d-flex">' +
                        (_docFileSize && '<span class="card-tag m-0 d-flex align-items-center justify-content-center size text-nowrap field-size">' + _docFileSize + '</span>') +
                        '                        <a class="card-link card-tag m-0 d-flex align-items-center justify-content-center stretched-link" href="' + fileHref + '" target="_blank">' +
                        '                           <hr class="card-link--seperator my-1">' +
                        '                           <i class="mx-2 icon-downarrow"></i>' + downloadButtonTitle + ' ' +
                        '                        </a>' +
                        '                     </div>' +
                        '                  </div>' +
                        '               </div>' +
                        '            </div>' +
                        '         </div>' +
                        '      </div>';

                    $(".ex-tender-head[data-tenderid='" + tenderdetailsID + "']").parent().find(".tenderdownloads").append(tenderDownloadHTML)
                }
                let _RecommendedTenders = TenderDetailsObj.TenderDetails.RecommendedTenders;

                for (let key in _RecommendedTenders) {
                    let _tenderdetailsDesc = _RecommendedTenders[key].TenderDetails;
                    if (!_tenderdetailsDesc) { _tenderdetailsDesc = " " }
                    else {
                        _tenderdetailsDesc = _tenderdetailsDesc.replace(/(<([^>]+)>)/ig, "")
                    };

                    let recommendedTenderInternalStatus = _RecommendedTenders[key].InternalStatus;
                    let _recommendedTenderInternalStatus = lookupDictionary(recommendedTenderInternalStatus);


                    let recommendedDueDays = "";
                    let UTC_recommendedDueDays = new Date(_RecommendedTenders[key].DueDate);
                    let monthElementDue = detectLanguage(monthNamesAr[UTC_recommendedDueDays.getMonth()], monthNamesEn[UTC_recommendedDueDays.getMonth()])
                    recommendedDueDays = UTC_recommendedDueDays.getDate() + " " + monthElementDue + " " + UTC_recommendedDueDays.getFullYear();




                    let recomendedtendersHTML = '<div class="col-lg-4 col-md-6 mb-4">' +
                        '<div class="ex-news-cards ex-news-cards--document-card-image rounded ex-news-cards--event h-100 overflow-hidden"><a  data-tenderrelatedid="' + _RecommendedTenders[key].TenderID + '" data-tenderrelatedname="' + _RecommendedTenders[key].TenderName + '" href="#" ><div class="ex-news-cards__cont position-relative h-100"><div class="ex-news-cards__card-details position-relative h-100"><div class="ex-news-cards__card-details__card-date d-flex justify-content-between">' +
                        (_recommendedTenderInternalStatus && '<div class="card-type-label text-uppercase"><div><span class="icon-calendar-book d-none"></span> ' + _recommendedTenderInternalStatus + '</div></div>') +
                        (recommendedDueDays && '<div class="card-date"><div class="card-date field-date">' + recommendedDueDays + '</div></div>') + '</div>' +
                        (_RecommendedTenders[key].TenderName && '<h5 class="card-title truncate truncate-2  mb-3 field-title">' + _RecommendedTenders[key].TenderName + '</h5>') +
                        (_tenderdetailsDesc && '<p class="ex-news-cards__card-details__card-text truncate truncate-5 field-shortdescription">' + _tenderdetailsDesc + '</p>') +
                        '</div><h4 class="document-card-image-download-link position-absolute mx-4"><span class="icon-arrow-right font-weight-boldest rotated-element d-block"></span></h4></div></a></div></div>';

                    $(".ex-tender-head[data-tenderid='" + tenderdetailsID + "']").parent().find(".recomendedtenders").append(recomendedtendersHTML)

                }


                $(".ex-news-cards a").on("click", function (e) {
                    e.preventDefault();
                    let _tenderID = $(this).data().tenderrelatedid
                    searchRelatedTender(_tenderID);
                })


            },
            //function for load more functionality show/hide
            tenderLoadmore = function (TenderCount) {
                if (TenderCount == tenderListcount || TenderCount == 1) {
                    resultIndicator(tenderListcount, TenderCount)
                    $("#load-more-tender").hide();
                }
                else if (TenderCount > tenderListcount) {


                    resultIndicator(tenderListcount, TenderCount)
                    //for next loadmore load another 10
                    tenderList_startIndex = tenderList_startIndex + tenderList_limit
                    $("#load-more-tender").show();


                } else if (TenderCount == 0) {
                    //if there's no result
                    $("#load-more-tender").hide();
                    resultIndicator(TenderCount, TenderCount)

                    tenderList_startIndex = 0;
                    $(".ex-tenders--listing").html(" ");
                } else if (TenderCount < tenderListcount) {
                    resultIndicator(tenderListcount - 1, tenderListcount - 1)
                    $("#load-more-tender").hide();
                }

                truncateElements();


            },
            //function related to 10/24 result top of tender listing 
            resultIndicator = function (currentCount, totalCount) {
                if ($(".current-counter").length) {
                    $(".current-counter").text(currentCount);
                    $(".total-counter").text(totalCount);
                } else {
                    $("#resultIndicator").html($("#resultIndicator").html().replace("{%size%}", ('<span class="current-counter">' + currentCount + '</span>')));
                    $("#resultIndicator").html($("#resultIndicator").html().replace("{%count%}", ('<span class="total-counter">' + totalCount + '</span>')));

                    //$("#current-count").text(currentCount)
                    //$("#total-count").text(totalCount)
                }
            },
            //function when user click on status nav tabs open/closed
            navfilterInit = function () {

                $(".nav-filter a").on("click", function (e) {
                    e.preventDefault();
                    // if (!($(this).hasClass("active"))) {
                    $(".nav-filter a").removeClass("active")
                    $(this).addClass("active")

                    InternalStatus = $(this).data().tenderfilter;
                    tenderList_startIndex = 0;

                    resetFilters()
                    calltenderPayload();
                    searchtenderReset();

                    if (!istenderDesktop) {

                        mobileHandle()
                    }
                    //}
                })

            },
            //function when user search for something the core scenarios 
            searchtenderCallListingCore = function searchtenderCallListingCore(thisInput) {
                if ($("#tender-search input").val().trim() == "") {
                    pageSize = 10,
                        loadmoreSize = 0,
                        response_totalCount = null;
                    tenderList_startIndex = 0;
                    filter_Name = "";
                    if (istenderDesktop) {
                        calltenderPayload();
                    }
                } else {
                    $(".ex-tenders--listing").html(" ");

                    tenderList_startIndex = 0;
                    filter_Name = encodeURIComponent(thisInput.val().trim());
                    if (istenderDesktop) {
                        //resetFilters();
                        calltenderPayload()
                    }
                }
            },
            //function when user search between mobile and desktop
            searchtenderCallListing = function () {
                if (istenderDesktop) {
                    $("#tender-search input").keyup(function (e) {
                        if (e.keyCode == 13) {
                            searchtenderCallListingCore($(this))
                        }
                    });
                } else {
                    mobileHandle()
                }
            },
            //function used to return the exact lookup dictionary
            lookupDictionary = function lookupDictionary(key) {
                let value;
                lookupArray.forEach(function (item) {
                    if (item.Key == key) {
                        value = item.Value;
                        return;
                    }
                });
                return value;
            },
            //function when user press on related tender
            searchRelatedTender = function searchRelatedTender(_tenderID) {
                $(".ex-tenders--listing").html(" ");
                $.ajax({
                    url: (locationAPIDetails + "/" + _tenderID + "?recommendedLimit=3"),
                    type: "GET",
                    beforeSend: function () {
                        $("#loaderDiv").show();
                    },
                    success: function (data) {
                        $("#loaderDiv").hide();
                        $("#no-listing-result").hide();
                        if (data.TenderDetails) {
                            $(".ex-tenders--listing").append(tenderListHead(data.TenderDetails))
                            $(".ex-tenders--listing .ex-tender-head").attr("data-tenderid", _tenderID)
                            tenderListBody(_tenderID, data)
                            $("#tender-search input").val(data.TenderDetails.TenderName)
                            //expand related search tender
                            $(".ex-tenders--listing .ex-tender").addClass("section")
                            $(".ex-tenders--listing .ex-tender").addClass("sectionLoadedTender")

                            $(".ex-tenders--listing").find(".ex-tender-body").slideDown(400, function () {
                                let _this = $(".ex-tenders--listing");
                                $('html, body').animate({
                                    scrollTop: (_this.offset().top - 150)
                                }, 500)
                            });

                            //check if it's completed tender or closed
                            if (data.TenderDetails.InternalStatus.toUpperCase() == "COMPL") {
                                $(".nav-filter a").removeClass("active")
                                $('.nav-filter a[data-tenderFilter="COMPL"]').addClass("active")
                                InternalStatus = "COMPL"
                            } else {
                                $(".nav-filter a").removeClass("active")
                                $('.nav-filter a[data-tenderFilter="OPEN"]').addClass("active")
                                InternalStatus = "OPEN"
                            }


                        }
                        tenderLoadmore(1)
                        //result indecator
                        resultIndicator(1, 1)
                    },
                    error: function (errorThrown) {
                        $("#loaderDiv").hide();
                        $("#call-error").show();
                        $("#no-listing-result").hide();
                        tenderLoadmore(0)
                        $(".ex-tenders--listing").html("")
                    }
                });

                truncateElements();

            },
            //function due filter core
            dueDateFiltersCore = function dueDateFiltersCore() {
                tenderList_startIndex = 0;
                filter_DueDate = $("input[name='dueDate']:checked").val();
            },
            //function due filter (mobile or desktop)
            dueDateFilters = function dueDateFilters() {
                if (istenderDesktop) {
                    $("input[name='dueDate']").change(function () {
                        dueDateFiltersCore();
                        //searchtenderReset();        
                        calltenderPayload();
                    })
                } else {
                    mobileHandle()
                }

            },
            //function search for tender and reset the page
            searchtenderReset = function searchtenderReset() {
                $("#tender-search input").val("");
                filter_Name = "";
            },
            //function for sorting filters core
            sortingFiltersCore = function sortingFiltersCore(thisInput) {
                tenderList_startIndex = 0;
                var optionSelected = thisInput.find("option:selected");
                filter_Sorting = optionSelected.val();

            },
            //function for sorting filters (mobile or desktop)
            sortingFilters = function sortingFilters() {
                if (istenderDesktop) {
                    $('select.sortingFilters').on('change', function (e) {
                        sortingFiltersCore($(this))
                        //searchtenderReset();
                        calltenderPayload();
                    });
                } else {
                    mobileHandle()
                }
            },
            //function to get all the filters from obj=> filtersPayload
            getFilterList = function getFilterList(filtersLists) {
                $.each(filtersLists.filtersLists, function (j, value) {
                    var valLimit = "";
                    if (filtersLists.filtersLists[j].Limit) {
                        if (filtersLists.filtersLists[j].ClassList == ".listCategories") {
                            if (window.location.href.indexOf("?category") != -1) {
                                valLimit = "";
                                //$(filtersLists.filtersLists[j].ClassList).parent().find(".showmoreLnk").hide();
                                //$(filtersLists.filtersLists[j].ClassList).parent().find(".showlessLnk").show();

                            } else {
                                valLimit = "?limit=" + filtersLists.filtersLists[j].Limit;
                            }
                        } else {
                            valLimit = "?limit=" + filtersLists.filtersLists[j].Limit;
                        }

                    }

                    $.ajax({
                        url: locationAPI + value.URL + valLimit,
                        type: value.Type,
                        cache: false,
                        beforeSend: function () {
                            $(filtersLists.filtersLists[j].ClassList).html(loadingHTML);
                        },
                        success: function (data) {
                            //add select all
                            if (filtersLists.filtersLists[j].ClassList == ".listCategories") {
                                data.Data.unshift({ ID: "_ALLCategories", NameEn: "All", NameAr: "الكل", lastTenderCreationDate: "" })
                            } else if (filtersLists.filtersLists[j].ClassList == ".listEntities") {
                                data.Data.unshift({ EntityId: "_ALLEntities", EntityName: "All", EntityURL: "", EntityLogo: "", TenderCount: "" })
                            }
                            if (data.Data.length) {
                                $(filtersLists.filtersLists[j].ClassList).html("")
                                $.each(data.Data, function (i, val) {
                                    drawFilterList(val, value);
                                })
                                $((filtersLists.filtersLists[j].ClassList) + ' .d-flex').each(function (n, m) {
                                    if (n >= 6) {
                                        $(this).removeClass("d-flex").addClass("d-none")
                                    }
                                })
                                //after show more
                                selectArrayofSelected(value);
                            } else (
                                $(filtersLists.filtersLists[j].ClassList).html("no filters exists")
                            )
                            //show more link logic
                            showmoreFilterList(value)
                            //clear all link logic
                            clearallFilterList(value)
                            //on click on filter input logic
                            filterbyFilter(value)

                        },
                        error: function (errorThrown) {

                        }
                    });

                })

            },
            //function to draw the filters html
            drawFilterList = function drawFilterList(itemFilter, FilterDetails) {
                let filter_template = $(".filter_template").html();
                filter_template = filter_template.replace(/{%_filter_id%}/g, itemFilter[FilterDetails.idName]);
                if ($('html[lang="ar-AE"]').length) {
                    filter_template = filter_template.replace(/{%_filter_Title%}/g, itemFilter[FilterDetails.arName]);
                } else {
                    filter_template = filter_template.replace(/{%_filter_Title%}/g, itemFilter[FilterDetails.enName]);
                }
                $(FilterDetails.ClassList).append(filter_template);
            },
            //function for click event for each filter
            filterbyFilter = function filterbyFilter(value) {

                $(value.ClassList).find("input").each(function () {
                    $(this).unbind().click(function (e) {
                        if ($(this).attr("id") == "_ALLCategories" || $(this).attr("id") == "_ALLEntities") {
                            if ($(this).is(":checked")) {
                                selectdeselectAllFilter(value)
                            } else {
                                //to act as a toggle and unselect all
                                $(value.ClassList).addClass("selectedAll")
                                selectdeselectAllFilter(value)

                            }
                        } else {
                            var checkallID = "#_ALLEntities";
                            if (value.ClassList == ".listCategories") {
                                checkallID = "#_ALLCategories";
                            }
                            $(value.ClassList).removeClass("selectedAll");
                            if ($(this).closest(".ex-sitecore-form__input").find(checkallID).is(":checked")) {
                                $(value.ClassList).find("input").each(function (i, j) {
                                    if (i > 0) {
                                        if ($(this).is(":checked")) {
                                            value.selected.push($(this).attr("id"))
                                        } else {
                                            value.selected.splice($.inArray($(this).attr("id"), value.selected), 1);
                                        }
                                    }
                                });
                            } else if ($(this).is(":checked")) {
                                value.selected.push($(this).attr("id"))

                            } else {
                                value.selected.splice($.inArray($(this).attr("id"), value.selected), 1);
                            }
                            /* var strFilters="";
                            $.each(filtersPayload.filtersLists, function( i, val ) {
                                strFilters=strFilters+val.selected.toString()
                                })*/
                            tenderList_startIndex = 0;
                            if (istenderDesktop) {
                                //searchtenderReset();

                                calltenderPayload();
                            } else {
                                mobileHandle()
                            }
                        }
                    })
                });


            },
            //function for select all and unselect all filter for each filter
            selectdeselectAllFilter = function selectdeselectAllFilter(value) {
                if ($(value.ClassList).hasClass("selectedAll")) {
                    $(value.ClassList).removeClass("selectedAll");
                    $(value.ClassList).find("input").each(function () {
                        $(this).prop("checked", false)
                    });
                    value.selected = [];
                    tenderList_startIndex = 0;
                    if (istenderDesktop) {
                        calltenderPayload();
                    }
                } else {
                    $(value.ClassList).find("input").each(function () {
                        $(this).prop("checked", true)
                    });
                    $(value.ClassList).addClass("selectedAll");
                    value.selected = [];
                    tenderList_startIndex = 0;
                    if (istenderDesktop) {
                        calltenderPayload();
                    }
                }

            },
            //function for show more and show less filter list
            showmoreFilterList = function showmoreFilterList(value) {

                $(value.ClassList).parent().find(".showmoreLnk").unbind().click(function (e) {
                    value.Limit = 0;
                    var tempest = { "filtersLists": [] };
                    tempest.filtersLists.push(value);

                    //to prevent calling api more than one time
                    //if ($(value.ClassList + ">div").length < 7) {
                    //get all filter with no limit and hide show more
                    // getFilterList(tempest);
                    //}

                    $(this).closest(".ex-sitecore-form__input").find(".listCategories>div").each(function (i, j) {
                        if (!$(this).hasClass("d-flex")) {
                            $(this).addClass("d-flex").removeClass("d-none");
                        }
                    });
                    $(this).closest(".ex-sitecore-form__input").find(".listEntities>div").each(function (i, j) {
                        if (!$(this).hasClass("d-flex")) {
                            $(this).addClass("d-flex").removeClass("d-none");
                        }
                    });
                    $(this).hide();
                    $(this).parent().find(".showlessLnk").show();
                    e.preventDefault();
                });

                $(value.ClassList).parent().find(".showlessLnk").unbind().click(function (e) {

                    $(this).closest(".ex-sitecore-form__input").find(value.ClassList + ">div").each(function (i, j) {
                        if (i > 5) {
                            $(this).removeClass("d-flex").addClass("d-none");
                        }
                    });

                    $(this).hide();
                    $(this).parent().find(".showmoreLnk").show();
                    e.preventDefault();
                });
            },
            //function for clear all filter  in "filtersPayload" object
            clearallFilterList = function clearallFilterList(value) {
                $(value.ClassList).parent().find(".clearALLLnk").unbind().click(function (e) {
                    $(value.ClassList).find("input").each(function () {
                        $(this).prop('checked', false);
                        value.selected.splice($.inArray($(this).attr("id"), value.selected), 1);
                    });


                    $(value.ClassList).addClass("selectedAll")
                    selectdeselectAllFilter(value)



                    e.preventDefault();
                });
            },
            //common function that call tender listing based on values in it
            calltenderPayload = function calltenderPayload() {

                tenderCallListing({
                    "status": $(".nav-filter a.active").data().tenderfilter,
                    "offset": tenderList_startIndex,
                    "limit": tenderList_limit,
                    "Category": filtersPayload.filtersLists[0].selected.toString(),
                    "Entity": filtersPayload.filtersLists[1].selected.toString(),
                    "Sorting": filter_Sorting,
                    "DueDate": filter_DueDate,
                    "Name": filter_Name
                });
            },
            //on page load this function is used to check the values in the array
            selectArrayofSelected = function selectArrayofSelected(value) {
                if ($(value.ClassList).hasClass("selectedAll")) {
                    $(value.ClassList).find("input").each(function () {
                        $(this).prop("checked", true);
                    })
                } else {
                    $(value.ClassList).find("input").each(function () {
                        if ($.inArray($(this).attr('id'), value.selected) != -1) {
                            $(this).prop("checked", true);
                        }
                    })
                }
                if (value.selected[0] == "SelectAll" && $("#_ALLCategories").length > 0) {
                    $(document).ready(function () {
                        if (!$("#_ALLCategories").prop("checked")) {
                            $("#_ALLCategories").click()
                        }
                    });
                }
                if (value.selected[1] == "SelectAll" && $("#_ALLEntities").length > 0) {
                    $("#_ALLEntities").prop("checked", true)
                }
            },
            //common function used to reset all filters
            resetFilters = function resetFilters() {
                //reset start index
                tenderList_startIndex = 0;
                filtersPayload.filtersLists[0].selected = [];
                filtersPayload.filtersLists[1].selected = [];
                filter_DueDate = "";
                filter_Sorting = "LAST_CREATED";
                filter_Name = "";
                //clear entites and categories list 
                $.each(filtersPayload.filtersLists, function (j, value) {
                    $(value.ClassList).find("input").each(function () {
                        $(this).prop('checked', false);
                        value.selected.splice($.inArray($(this).attr("id"), value.selected), 1);
                    });

                })
                //clear sorting return to default which is "LAST_DUEDATE"
                $('select.sortingFilters').val("LAST_CREATED");

                //clear duedate filter
                $("input[name='dueDate']:checked").prop("checked", false)


            },
            //function that work on mobile only to handle related scenarios 
            mobileHandle = function mobileHandle() {
                if (!istenderDesktop) {
                    $("#applyFilters").unbind().click(function () {
                        //check search
                        searchtenderCallListingCore($("#tender-search input"))
                        //sorting filters
                        sortingFiltersCore($('select.sortingFilters'))
                        //sorting due date 
                        dueDateFiltersCore();

                        //call api for listing 
                        calltenderPayload();

                        $.fancybox.close();
                    })
                }
            },
            clearCustoms = function clearCustoms() {
                $(".clearSearch").on("click", function (e) {
                    $("#tender-search input").val('');
                    pageSize = 10,
                        loadmoreSize = 0,
                        response_totalCount = null;
                    tenderList_startIndex = 0;
                    filter_Name = "";
                    if (istenderDesktop) {
                        calltenderPayload();
                    }
                    e.preventDefault();
                })
                $(".clearDuedate").on("click", function (e) {
                    if (istenderDesktop) {
                        $("#CLOSE_IN_0D").click();
                    } else {
                        $("#CLOSE_IN_0D").prop("checked", true);
                    }
                    e.preventDefault();
                })
            },
            //verify URL Language switcher function 
            resetLangSwitcher = function resetLangSwitcher(){
                if($('div[data-language-code="ar"]').length>0){
                    $('div[data-language-code="ar"] a').attr("href","/ar-AE/For-Suppliers/Public-Tenders")
                }else{
                    $('div[data-language-code="en"] a').attr("href","/en/For-Suppliers/Public-Tenders")
                }
            }


        return {
            init: init
        };
    })();

    $(document).ready(function () {
        //activate mobile and tablet actions 
        if ($(window).width() < 1100) {
            $(".component-tender-wrap").removeClass("col-lg-9").addClass("col-12");
            $(".search-filters").appendTo("#dialog-filter .ex-tenders");
            $(".sorting-filters-sort-filter").appendTo("#dialog-filter .ex-tenders");
            $(".sorting-filters").appendTo("#dialog-filter .ex-tenders");
            $(".nav-status").appendTo("#dialog-status .ex-tenders");
        }
        //init tender code
        Tenders.init();


    });
}
