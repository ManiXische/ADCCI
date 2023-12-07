var listingPage = (function () {
    var init = function () {
        _filterationControls__initiation();
        _search__Init();
        _loadMore__Init();
        _filters__Init();
        _sorting__Init();
        _listingPage__Init();
        _mobileInit();
    },
    paramsJSON = {
        template: document.Template,   // - from js variable 
        site: document.Site,    // - from js variable 
        PublicationCategory: "",   // - category filters
        PublicationType: "",       // - publication filters
        SortBy: document.querySelector('[listing_soting__wrap] select option:first-of-type') ? document.querySelector('[listing_soting__wrap] select option:first-of-type').dataset.value : null ,
        SortDirection: document.querySelector('[listing_soting__wrap] select option:first-of-type')? document.querySelector('[listing_soting__wrap] select option:first-of-type').dataset.sortDir : null ,
        searchquery: "",
        Page: 1,
        Language: document.documentElement.lang == 'en' ? 'en' : 'ar-AE',
        PageSize: "9" //- cards no per page
    },
    mapParamKeys ={
        search : 'q',
        sortDirection : 'dir',
        sortType : 'sort'
    },
    templateData ={
        container: document.querySelector('[template-container]'),
        template : document.querySelector('[template-container] [template].d-none:first-of-type') ? document.querySelector('[template-container] [template].d-none:first-of-type').cloneNode(true) : null ,
        templateParnt : document.querySelector('[template-parent]'),
        pageNumber : document.querySelector('[template-container] [listing_loadmore__btn]')? document.querySelector('[template-container] [listing_loadmore__btn]').dataset.pageno : null,
        loader : document.querySelector('[template-container] [listing_loadmore__btn]')
    },
    sharedData ={
        urlParams: new URLSearchParams(window.location.search.slice(1)),
        pageNumber: 1,
        mobileFilter: false
    },
    testResponse = {
        "TotalCount": 12,
        "Data": [
            {
                "Title": "Publication2",
                "Description": "gggggg iuhuhuh eiufguwegfue fuwygefuywgfuyg dufygsduygfudgf usygfusygfuys fusygfuygygfs uwgfuasg fuaysgfuaygsufyag fuygfausyg fausyguyaguaygs fuaygfuasy fuaygf uasygfuyags fuagfiugaf auygfasgfugf asugfua sfugas fuasygf ",
                "Image": "https://via.placeholder.com/278x164.png",
                "Date": "23 MAY 2019",
                "Types": [
                    // {
                    //     "Title": "Type1"
                    // },
                    // {
                    //     "Title": "Type2"
                    // }
                ],
                "Categories":[
                    // {
                    //     "Title": "Category2",
                    //     "Icon": "https://via.placeholder.com/24x24.png",
                    // }
                ],
                "Files": [
                    {
                        "Title": "File1",
                        "Path": "https://stage.tamm.abudhabi/master-site/-/media/DED-Documents/Invitation2-For-Public-Tenders-En.pdf",
                        "Type": "pdf",
                        "Size": 3976877
                    }
                ]
            },
            {
                "Title": "Publication2",
                "Description": "gggggg",
                "Image": "/-/media/Project/First-tenant/First-site/kiosk.svg",
                "Date": "24 يونيو 2021",
                "Types": [
                    {
                        "Title": "Type1"
                    },
                    {
                        "Title": "Type2"
                    }
                ],
                "Categories":[
                    {
                        "Title": "Category2",
                        "Icon": "https://via.placeholder.com/24x24.png",
                    },
                    {
                        "Title": "Category2",
                        "Icon": "https://via.placeholder.com/24x24.png",
                    }
                ],
                "Files": [
                    {
                        "Title": "File1",
                        "Path": "https://stage.tamm.abudhabi/master-site/-/media/DED-Documents/Invitation2-For-Public-Tenders-En.pdf",
                        "Type": "pdf",
                        "Size": 3976877
                    },
                    {
                        "Title": "File2",
                        "Path": "/-/media/Project/First-tenant/First-site/sample-pdf-with-images.pdf",
                        "Type": "pdf",
                        "Size": 3976877
                    }
                ]
            },
            {
                "Title": "Publication1",
                "Description": "gggggghh",
                "Image": "/-/media/Project/First-tenant/First-site/kiosk.svg",
                "Date": "/Date(-62135596800000)/",
                "Types": [
                    {
                        "Title": "Type1"
                    },
                    {
                        "Title": "Type2"
                    }
                ],
                "Categories":[
                    {
                        "Title": "Category2",
                        "Icon": "https://via.placeholder.com/24x24.png",
                    },
                    {
                        "Title": "Category2",
                        "Icon": "https://via.placeholder.com/24x24.png",
                    },
                    {
                        "Title": "Category2",
                        "Icon": "https://via.placeholder.com/24x24.png",
                    }
                ],
                "Files": [
                    {
                        "Title": "File1",
                        "Path": "https://stage.tamm.abudhabi/master-site/-/media/DED-Documents/Invitation2-For-Public-Tenders-En.pdf",
                        "Type": "pdf",
                        "Size": 3976877
                    },
                    {
                        "Title": "File2",
                        "Path": "/-/media/Project/First-tenant/First-site/sample-pdf-with-images.pdf",
                        "Type": "pdf",
                        "Size": 3976877
                    },
                    {
                        "Title": "File3",
                        "Path": "/-/media/Project/First-tenant/First-site/sample-pdf-with-images.pdf",
                        "Type": "pdf",
                        "Size": 3976877
                    }
                ]
            }
        ],
        "ResponseStatus": 200
    },
    _listingPage__Init = function(){

        //https://jira.tamm.abudhabi/jira/browse/ADGESITE-12632
        //we need to show odd number if we have three columns and even number if we have two column
        if(window.innerWidth < 992){
            paramsJSON.PageSize = "10";
        }

        // --- get data from dictionary API
        var labels = templateData.template.querySelectorAll('[data-dictionary-key]');
        if(labels){
            [].map.call(labels , function(label){

                // JSON.parse(document.Lookups).forEach(element => {
                //     if(element.Key == label.dataset.dictionaryKey){
                //         label.innerHTML = element.Value;
                //     }
                // });
                var lookups = JSON.parse(document.Lookups);
                for (var lookupIndex = 0; lookupIndex < lookups.length; lookupIndex++) {
                    if(lookups[lookupIndex].Key == label.dataset.dictionaryKey){
                        label.innerHTML = lookups[lookupIndex].Value;
                    }
                    
                }
            })
        }

        // --- remove rendered template after cloning it 
        var renderedTemplate = document.querySelector('[template-container] [template].d-none:first-of-type');
        renderedTemplate.parentNode.removeChild(renderedTemplate);

        // --- get header values and send request "loadData()"
        _LoadData();
        console.log('Api called')

        // --- bind event when resize or back to desktop incase if we have filter popup not closed need to undo changes in desktop
        window.addEventListener('resize', function(){
            if (!( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/.test(navigator.userAgent.toLowerCase()) )){
                console.log('not mobile');
                if(sharedData.mobileFilter){
                    _undoChanges__MobileFilter();
                    window.location.reload();
                }
            }
        });
        
    },
    _search__Init = function () {

        var searchInput = document.querySelector('[listing_search__input]');
        if(searchInput){

            // --- bind event when click on enter  
            searchInput.onkeydown = function(e){
                if(e.which == 13) {
                    e.preventDefault();
                    var linkText = searchInput.value;
                    _searchUpdates(linkText);
                }
            }
        }

        var searchBtn = document.querySelector('[listing_search__btn]')
        if(searchBtn){
            // --- bind event when click search icon
            searchBtn.onclick = function(e){
                e.preventDefault();
                var searchWrapper = _getClosest(searchBtn , '[listing_search__wrap]');
                var linkText = searchWrapper.querySelector('[listing_search__input]').value;
                _searchUpdates(linkText);
            }
        }
    },
    _filters__Init = function () {
        var filterWrapper = document.querySelector('[listing_filters__wrap]');
        if(filterWrapper){
            var filters = filterWrapper.querySelectorAll('[data-filter]');
            if(filters){
                [].map.call(filters , function(filter){
                    // --- get data from filter API         
                    var filterGroup = filter.dataset.filter;
                    mapParamKeys[filterGroup] = filterGroup;
                    mapParamKeys[filterGroup + 'all'] = filterGroup + 'all';
                    
                    // --- bind filters inputs when change events
                    var filterInputs = filter.querySelectorAll('input');
                    if(filterInputs){
                        [].map.call(filterInputs, function(input){
                            input.addEventListener('change', function(e){
                                var filterParamValue = _urlParamsValues('get',filterGroup);
                                var currentSelection = input.dataset.id;
                                if(input.checked){
                                    // if checked Update URL Params
                                    if(_getClosest(input, '[check-all]')){
                                        var allInputs = _getClosest(input , '[data-filter]').querySelectorAll('.checkbox__wrapper:not([check-all]) input');
                                        var allselections="";
                                        [].map.call(allInputs , function(oneInput){
                                            if(allselections != ""){
                                                allselections = allselections + ',' + oneInput.dataset.id;
                                            }else{
                                                allselections = allselections + oneInput.dataset.id;
                                            }
                                        });
                                        _urlParamsValues('set' , filterGroup , allselections);
                                        _urlParamsValues('set' , filterGroup + 'all' , filterGroup);
                                    }else{
                                        if (filterParamValue){
                                            _urlParamsValues('set' , filterGroup , (filterParamValue + ',' + currentSelection) );

                                            var allInputs = _getClosest(input , '[data-filter]').querySelectorAll('.checkbox__wrapper:not([check-all]) input');
                                            var newAllSelections = filterParamValue.split(',');
                                            if((newAllSelections.length + 1) == allInputs.length){
                                                _urlParamsValues('set' , filterGroup + 'all' , filterGroup);
                                            }

                                        }else{
                                            _urlParamsValues('set' , filterGroup , currentSelection);
                                        }
                                    }
                                }else{
                                    // if unchecked Remove value from URL Params
                                    if(_getClosest(input, '[check-all]')){
                                        _urlParamsValues('delete' , filterGroup);
                                    }else{
                                        if (filterParamValue){
                                            var newAllSelections = filterParamValue.split(',');
                                            newAllSelections.forEach(function(item,indx){
                                                if(item === currentSelection){
                                                    newAllSelections.splice(indx, 1).join();
                                                }
                                            })
                                            if(newAllSelections.length > 0){
                                                _urlParamsValues('set' , filterGroup , newAllSelections);
                                            }else{
                                                _urlParamsValues('delete' , filterGroup);
                                            }
                                        }
                                    }
                                    _urlParamsValues('delete' , filterGroup + 'all' , filterGroup);
                                }
                                // --- when select option should update page by 1 then call API
                                templateData.pageNumber = 1;
                                _LoadData();
                                console.log('Api called')
                            });

                        });     
                    }

                    var clearBtn = filter.querySelector('[clear]');
                    if(clearBtn){
                        clearBtn.addEventListener('click', function(e){
                            var AllBtn = filter.querySelector('[check-all] input');
                            AllBtn.checked = true;
                            AllBtn.click();
                        });
                    }
                });
            }
        }
        
    },
    _sorting__Init = function () {
        var sortWrapper = document.querySelector('[listing_soting__wrap]');
        var sortingSelect = sortWrapper.querySelector('select');
        if(sortingSelect){
            // --- when first load update select with querystring value if any
            // var sortDirection = _urlParamsValues('get','sortDirection');
            // var sortType = _urlParamsValues('get','sortType');
            // if(sortType && sortType != undefined && sortDirection && sortDirection != undefined){
            //     // _urlParamsValues('set','sortDirection',sortDirection);
            //     // _urlParamsValues('set','sortType',sortType);
            //     sortWrapper.querySelector('.ex-listing-page__sort--dropdown--text').innerHTML = sortingSelect.querySelector('option[data-sort-dir="' + sortDirection + '"]' ).value
            // }else{
            //     _urlParamsValues('set','sortDirection',paramsJSON.SortDirection);
            //     _urlParamsValues('set','sortType',paramsJSON.SortBy);
            // }

            // --- bind sorting events
            var links = sortWrapper.querySelectorAll('.ex-listing-page__sort--dropdown--list a');
            if(links){
                [].map.call(links, function(link){
                    link.addEventListener('click', function(e){
                        _urlParamsValues('set','sortDirection',link.dataset.sortDir);
                        _urlParamsValues('set','sortType',link.dataset.value);
                        // --- when select option should update page by 1 then call API
                        templateData.pageNumber = 1;
                        _LoadData();
                        console.log('Api called')
                    });
                });
            }
        }
    },
    _loadMore__Init = function () {
        // --- bind loadmore events
        var loadmoreBtn = document.querySelector('[listing_loadmore__btn]');
        if(loadmoreBtn){
            loadmoreBtn.onclick = function(e){
                e.preventDefault();
                templateData.pageNumber = parseInt(templateData.pageNumber) + 1 ;
                loadmoreBtn.dataset.pageno = templateData.pageNumber;

                _LoadData();
                console.log('Api called')
            }
        }
    },
    _mobileInit = function (){
        // --- bind filter btn 
        // -- when click on filter btn update sharedData with current URLParams and pageNumber and SortingOptions 
        var filterBtn = document.querySelector('[form-open]');
        if(filterBtn){
            filterBtn.addEventListener('click', function(){
                sharedData.urlParams = new URLSearchParams(window.location.search.slice(1));
                sharedData.pageNumber = templateData.pageNumber;
                sharedData.mobileFilter = true;
            });
        }

        // ---- bind close popup without filter
        // when click close or cancel update page number and URL with last state before open filter in mobile ----> then loadData
        var filterCloseBtns = document.querySelectorAll('[form-close]');
        if(filterCloseBtns){
            [].map.call(filterCloseBtns, function(closeBtn){
                closeBtn.addEventListener('click', function(){
                    _undoChanges__MobileFilter();
                    _LoadData();
                    _filterationControls__initiation();
                });
            })
           
        }
        
        // ---- bind event when apply filters btn clicked 
        var filterApply = document.querySelector('[form-apply]');
        if(filterApply){
            filterApply.addEventListener('click', function(){
                sharedData.mobileFilter = false;
                var linkText = document.querySelector('[listing_search__input]').value;
                _searchUpdates(linkText);
            });
        }

    },
    _filterationControls__initiation = function (){
        // --- when first load update search input with querystring value if any
        var searchInput = document.querySelector('[listing_search__input]');
        if(searchInput){
            var searchQuery = _urlParamsValues('get','search');
            if(searchQuery && searchQuery != undefined){
                searchInput.value = searchQuery;
            }
        }

        // --- when first load update select with querystring value if any
        var sortWrapper = document.querySelector('[listing_soting__wrap]');
        var sortingSelect = sortWrapper.querySelector('select');
        if(sortingSelect){
            var sortDirection = _urlParamsValues('get','sortDirection');
            var sortType = _urlParamsValues('get','sortType');
            if(sortType && sortType != undefined && sortDirection && sortDirection != undefined){
                sortWrapper.querySelector('.ex-listing-page__sort--dropdown--text').innerHTML = sortingSelect.querySelector('option[data-sort-dir="' + sortDirection + '"]' ).value
            }else{
                _urlParamsValues('set','sortDirection',paramsJSON.SortDirection);
                _urlParamsValues('set','sortType',paramsJSON.SortBy);
            }
        }

        // --- when first load update filters checkboxes with querystring value if any
        var filterWrapper = document.querySelector('[listing_filters__wrap]');
        if(filterWrapper){
            var filters = filterWrapper.querySelectorAll('[data-filter]');
            if(filters){
                [].map.call(filters , function(filter){
                    // --- get data from filter API         
                    var filterGroup = filter.dataset.filter;
                    mapParamKeys[filterGroup] = filterGroup;
                    var filtergroupParam = _urlParamsValues('get',filterGroup);
                    if(filtergroupParam && filtergroupParam != undefined){
                        // -- check values inputs
                        updateCheckedOpt(filter,filterGroup);
                    }else{
                        var filterationInputs = filter.querySelectorAll('.checkbox__wrapper input');
                        [].map.call(filterationInputs, function(input){
                            input.checked = false;
                        })
                    }

                });
            }
        }

        function updateCheckedOpt(filter,filterGroup){
            var filterParamValues = _urlParamsValues('get',filterGroup);
            if(filterParamValues){
                var optionsToSelect = filterParamValues.split(',');
                var filterationInputs = filter.querySelectorAll('.checkbox__wrapper:not([check-all]) input');
                if(filterationInputs){
                    var count = 0;
                    filterationInputs.forEach(function(item,indx){
                        var o = item.dataset.id;
                        if(optionsToSelect.indexOf(o) != -1){
                            item.checked = true;
                            count+= 1;
                        }else{
                            item.checked = false;
                        }
                        if(filterationInputs.length == count ){
                            var checkAll = filter.querySelector('.checkbox__wrapper[check-all] input');
                            if(checkAll){
                                checkAll.checked = true;
                            }
                        }
                    })
                }
            }
        }

    },
    _undoChanges__MobileFilter= function (){
        sharedData.mobileFilter = false;
        templateData.pageNumber = sharedData.pageNumber;
        window.history.pushState('', '', '?' + sharedData.urlParams.toString());
    },
    _searchUpdates = function (linkText){
        var searchQuery = _urlParamsValues('get','search');
        if( (linkText != searchQuery)  && (linkText|| searchQuery) ){
            if(linkText.length > 0){
                _urlParamsValues('set','search',linkText);
            }else{
                _urlParamsValues('delete','search');
            }
            // templateData.loader.dataset.pageno = 1;
            templateData.pageNumber = 1;
            _LoadData();
            console.log('Api called')
        } 
    },
    _LoadData = function() {
        _getValues__SendRequest();
        _sendRequest__ListingAPI(renderResponse);
    },
    _urlParamsValues = function(type,name,value){
        // var mapParamKeys = {
        //     search : 'q',
        //     sortDirection : 'dir',
        //     sortType : 'sort',
        //     filter1 : 'f1',
        //     filter2 : 'f2',
        // }

        var urlParams = new URLSearchParams(window.location.search.slice(1));
        switch(type) {
            case 'set':
                urlParams.set(mapParamKeys[name],value);
                window.history.pushState('', '', '?' + urlParams.toString());
                return urlParams;
            //   break;
            case 'get':
                return urlParams.get(mapParamKeys[name]);
            case 'delete':
                urlParams.delete(mapParamKeys[name]);
                window.history.pushState('', '', '?' + urlParams.toString());
                return urlParams;
            //   break;
            default:
                return urlParams.get(mapParamKeys[name]);
          }
    },
    _getValues__SendRequest = function () {
        // Assigning Values
        getSearchKeyword();
        getFilterOptions();
        getSortingOption();
        getPageNo();


        function getSearchKeyword(){
            paramsJSON.searchquery = _urlParamsValues('get', 'search');
        }
        function getFilterOptions(){
            var filterWrapper = document.querySelector('[listing_filters__wrap]');
            var filters = filterWrapper.querySelectorAll('[data-filter]');
            if(filters){
                [].map.call(filters , function(filter){
                    var filterGroup = filter.dataset.filter;
                    if(_urlParamsValues('get' , filterGroup + 'all') == filterGroup){
                        paramsJSON[filterGroup] = null;
                    }else{
                        var filtergroupParam = _urlParamsValues('get',filterGroup);
                        paramsJSON[filterGroup] = filtergroupParam;
                    }
                    
                });
            }
        }
        function getSortingOption(){
            paramsJSON.SortBy = _urlParamsValues('get', 'sortType');
            paramsJSON.SortDirection = _urlParamsValues('get', 'sortDirection');
            
        }
        function getPageNo(){
            paramsJSON.Page = templateData.pageNumber;
        }
    },
    _sendRequest__ListingAPI = function(cb) {
        var dataTosend = paramsJSON;
        _loadding(true);

        //renderResponse(testResponse);     // -- to be uncoment when testing locally ,and to be commented when deploy 

        axios.post( getAPIUrl() ,
            dataTosend,
            {
                headers: {
                'Content-Type': 'application/json'
                }
            })
            .then(function (response) {
                var noResult = document.querySelector('#no-result');
                var callError = document.querySelector('#call-error');
                var resultCount = document.querySelector('[listing_showingresult__wrap]');
                if(response.data.ResponseStatus == 200){ // - Good request with Data
                    templateData.templateParnt.classList.remove('d-none');
                    renderResponse(response.data);
                    noResult.classList.add('d-none');
                    callError.classList.add('d-none');
                    resultCount.style.opacity = 1;
                }else if(response.data.ResponseStatus == 204){ // - no data found 
                    templateData.templateParnt.classList.add('d-none');
                    document.querySelector('[listing_loadmore__wrap]').classList.add('d-none');
                    noResult.classList.remove('d-none');
                    callError.classList.add('d-none');
                    resultCount.style.opacity = 0;
                }else if(response.data.ResponseStatus == 500){ // - request failed  from backend   --  BAD_REQUEST = 400
                    templateData.templateParnt.classList.add('d-none');
                    document.querySelector('[listing_loadmore__wrap]').classList.add('d-none');
                    noResult.classList.add('d-none');
                    callError.classList.remove('d-none');
                    resultCount.style.opacity = 0;
                }
                _loadding(false);
                $(window).trigger('resize');

            }).catch(function (error) {

                console.log(error);
                _loadding(false);
            });
        function getAPIUrl(){
            var host = window.location.host;
            var baseUrl = "https://" + host;
            // var reqEndPoint = templateData.dataset.apiEndpoint;
            var reqEndPoint = document.EndPoint;
            var url = baseUrl + "/" + paramsJSON.Language + "/" + reqEndPoint;

            return url;
        }
    },
    renderResponse = function(response) {
        if(paramsJSON.Page == 1){
            templateData.templateParnt.innerHTML = "";
        }
        var loadedItems = document.querySelectorAll('[template]')
        var loadedItems_no = loadedItems.length + response.Data.length;

        //- Update showing result no and page no for load more
        var loadedItems_no_lbl = document.querySelector('[listing_showingresult__wrap] [listing_showingresult__page]');
        var TotalCount_lbl = document.querySelector('[listing_showingresult__wrap] [listing_showingresult__total]');
        loadedItems_no_lbl.innerHTML = loadedItems_no;
        TotalCount_lbl.innerHTML = response.TotalCount;

        // - for loadmore btn
        if(loadedItems_no < response.TotalCount){
            document.querySelector('[listing_loadmore__wrap]').classList.remove('d-none');
        }else{
            document.querySelector('[listing_loadmore__wrap]').classList.add('d-none');
        }

        // - for sorting


        //- render listing component 
         //- append response data
        for (var i = 0; i < response.Data.length; i++) {
            var card = _mapTemplate(response.Data[i]);
            card = _bindTemplateEvents(card);
            _appendData(card);
        }
        
    },
    // map object to a template
    _mapTemplate = function (object) {
                
        // return template html
        var templateHtml = templateData.template.cloneNode(true);

        var items = templateHtml.querySelectorAll('[data-temp-attr]');
        if (templateHtml) {
          if (templateHtml.dataset.tempAttr && templateHtml.dataset.tempType) {
            _mapOneTemplateItem(templateHtml);
          }
        }
        if(items){
            // [].map.call(items , (item) => {
            //   _mapOneTemplateItem(item)
            // })
            [].map.call(items , function(item){
                _mapOneTemplateItem(item)
            })
        }
        function _mapOneTemplateItem(item){
          var key = item.dataset.tempAttr;
          var value = object[key];
          var type = item.dataset.tempType;
          var attrName = "attr-name";
          _CallMapValueOrDeleteEl(item, type, value, attrName);
          if (item.hasAttribute("data-temp-attr-1")) {
              
            var key = item.getAttribute("data-temp-attr-1");
            var value = object[key];
            var type = item.getAttribute("data-temp-type-1");
            var attrName = "attr-name-1";
            _CallMapValueOrDeleteEl(item, type, value, attrName);
          }
          if (item.hasAttribute("data-temp-attr-2")) {
              var key = item.getAttribute("data-temp-attr-2");
              var value = object[key];
              var type = item.getAttribute("data-temp-type-2");
              var attrName = "attr-name-2";
              _CallMapValueOrDeleteEl(item, type, value, attrName);
          }
        }
        function _CallMapValueOrDeleteEl(item, type, value, attrName){
            if(value && value.length > 0){ //why i check the length of value? because if the value is an array i need to know if it has data or not. 
                _mapValue(item, type, value, attrName);
            }else{
                var parent = _getClosest(item , '[temp-atrr-parent]');
                if(parent){
                    parent.parentNode.removeChild(parent);
                }else{
                    item.parentNode.removeChild(item);
                }
            }
        }
        return templateHtml;
    },
    //- map keys with values 
    _mapValue = function(el, type, value, attrName) {
        switch (type) {
          case "img":
            el.setAttribute("src", value);
            break;
          case "txt": 
            el.innerHTML= value;
            break;
          case "url":
            var urlBase = el.dataset.urlBase ? el.dataset.urlBase : "";
            var url = urlBase + value;
            if (url) {
              el.setAttribute("href", url);
            } else {
              el.removeAttribute("href");
            }
            break;
          case "class":
            el.setAttribute("class", value);
            break;
          case "bckgnd":
            el.style.backgroundImage = 'url("' + value + '")';
            break;
          case "attr": 
            var attr = el.getAttribute(attrName);
            el.setAttribute(attr, value);
            break;
          case "list":
              if(el.dataset.condition == "publication"){
                  if(value.length == el.dataset.conditionType || (el.dataset.conditionType == 3 && value.length > 3)){
                    value.forEach(function(val, indx){
                        var templateHtml = _mapListTemplate(el,val,indx);
                        if( el.querySelector('[list-template-parent]') ){
                            el.querySelector('[list-template-parent]').appendChild(templateHtml);
                        }else{
                            el.appendChild(templateHtml);
                        }
                    })
                  }else{
                    el.parentNode.removeChild(el);
                  }
              }else{
                    value.forEach(function(val, indx){
                        var templateHtml = _mapListTemplate(el,val,indx);
                        el.appendChild(templateHtml);
                    })
              }
            
            break;
          default:
            el.innerHTML= value;
        }
    },
    _mapListTemplate = function (el,object,indx) {
                
        // return template html
        var templateHtml = el.querySelector('[list-template]:first-of-type').cloneNode(true);
        if(indx == 0){
            // el.querySelector('[list-template]:first-of-type').remove();
            el.querySelector('[list-template]:first-of-type').parentNode.removeChild(el.querySelector('[list-template]:first-of-type'));
        }
        var items = templateHtml.querySelectorAll('[data-list-temp-attr]');
        if (templateHtml) {
            if (templateHtml.dataset.listTempAttr && templateHtml.dataset.listTempType) {
                _mapOneTemplateItem(templateHtml);
            }
        }
        if(items){
            // [].map.call(items , (item) => {
            //     _mapOneTemplateItem(item)
            // })
            [].map.call(items , function(item)  {
                _mapOneTemplateItem(item)
            })
        }

        function _mapOneTemplateItem(item){
          var key = item.dataset.listTempAttr;
          var value = object[key];
          var type = item.dataset.listTempType;
          var attrName = "attr-name";
          _mapValue(item, type, value, attrName);
          if (item.hasAttribute("data-list-temp-attr-1")) {
              
              var key = item.getAttribute("data-list-temp-attr-1");
              var value = object[key];
              var type = item.getAttribute("data-list-temp-type-1");
              var attrName = "attr-name-1";
              _mapValue(item, type, value, attrName);
          }
          if (item.hasAttribute("data-list-temp-attr-2")) {
              var key = item.getAttribute("data-list-temp-attr-2");
              var value = object[key];
              var type = item.getAttribute("data-list-temp-type-2");
              var attrName = "attr-name-2";
              _mapValue(item, type, value, attrName);
          }
        }
        return templateHtml;
    },
    _bindTemplateEvents = function(template){
        // -- bind dropdown links Events if there is any 
        var ddLinks = template.querySelectorAll('[custom_ddlinks__wrap]');
        if(ddLinks){
            [].map.call(ddLinks ,function(ddLink){
                var linkList = ddLink.querySelector('[custom_ddlinks__list]');
                var ddLinksBtn = ddLink.querySelector('.dropdown-link');
                ddLinksBtn.onclick = function(e){
                    if(ddLink.classList.contains('active')){
                        ddLink.classList.remove('active');
                        linkList.style.display = "none";
                    }else{
                        ddLink.classList.add('active');
                        linkList.style.display = "block";
                    }
                }
                var links = linkList.querySelectorAll('a');
                if(links){
                    [].map.call(links, function(link){
                        link.addEventListener("click", function(e){
                            ddLinksBtn.click();
                        })
                    })
                }
            });
        }
        return template;
    },
     //- append html to the container
    _appendData = function(template) {   
        template.classList.remove('d-none');
        templateData.templateParnt.appendChild(template);
          
        return template;
    },
    _loadding = function(flag){
        // --- add loader when API is fetching
        var loader = document.querySelector('#loaderDiv');
        if(loader){
            if(paramsJSON.Page == 1){
                if(flag == true){
                    // add loader
                    loader.classList.remove('d-none');
                }else{
                    // remove loader
                    loader.classList.add('d-none');
                }
            }else{
                // remove loader
                loader.classList.add('d-none');
            }
        }
    },
    _stopPropagation = function (elem) {
        elem.onclick = function (e) {
            e.stopPropagation();
        };
    },
    _getClosest = function (elem, selector) {
        //---/////////----> Element.matches() polyfill
        if (!Element.prototype.matches) {
            Element.prototype.matches =
                Element.prototype.matchesSelector ||
                Element.prototype.mozMatchesSelector ||
                Element.prototype.msMatchesSelector ||
                Element.prototype.oMatchesSelector ||
                Element.prototype.webkitMatchesSelector ||
                function (s) {
                    var matches = (this.document || this.ownerDocument).querySelectorAll(s),
                        i = matches.length;
                    while (--i >= 0 && matches.item(i) !== this) { }
                    return i > -1;
                };
        }

        //---/////////----> Get closest match
        for (; elem && elem !== document; elem = elem.parentNode) {
            if (elem.matches(selector)) { return elem };
        }

        return null;
    }
    return {
        init: init
    };
})();

jQuery().ready(function () {
    if($(".ex-listing-page").length){
        listingPage.init();
    }

});


