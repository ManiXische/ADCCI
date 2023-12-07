/***************************************************************************************************
Extension Name: \\ex-map
File: component-map
Owner: Wael Gomaa
Version: 1.0.0
***************************************************************************************************/
$(document).ready(function () {
    let isExEditor = $("body").hasClass("on-page-editor");
    let tabContainer = $(".ex-map__tabs");
    let mapContainer = $(".ex-map");
    let listContainer = $(".searching-box__results__list ul");
    let map,view,graphicsLayer;
    let initCenter = [54.482373, 24.423722], 
    currentGraphics = [],
    initZoom = 16;
    let smartDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    let dictionry = {
        "en" : {
            "zoom" : "To zoom in please double-click the map or use zoom in/out buttons.",
            "pan" : "Please use two fingers to pan the map.",
            "fullExtent" : "Full Extent",
            "lightmap" : "Light Map",
            "darkmap" : "Dark Map",
        },
        "ar-ae" : {
            "zoom" : "من فضلك قم بالنقر مرتين متتاليتين أو إستخدم أزرار التصغير والتكبير علي جانب الخريطة",
            "pan" : "من فضلك قم بإستخدام إصبعين للتحريك",
            "fullExtent" : "ملء الشاشة",
            "darkmap" : "خريطة داكنة",
        }
    }

    function togglePopup(geom , title){
         // open pop
    view.popup.open({
        location: geom,  // location of the click on the view
        // "title": "You clicked here",  // title displayed in the popup
        content: title  // content displayed in the popup
    });
    }
    // check if map is exists & esri api has been loaded & data list is not empty
    if(typeof require != "undefined" && tabContainer.length ){
        if(document.getElementById("mapDiv")){
   
            let pinPointURL = $("#mapDiv").data("pinpoint");
            // Hoisted variables
            let rtl = $.checkSiteRTLDirection(),
            lang = $("html").attr("lang").toLowerCase();

            // activate tabs 
            tabContainer.children("li").each(function(idx , tab){
                $(tab).on("click", function(){
                    currentGraphics = [];
                    tabContainer.children().removeClass("active");
                    $(this).addClass("active");


                    var id = $(this).data("id");
                    listContainer.children().hide();
                    $("[data-tab='"+id+"']").show();

                    // toggle graphics 
                    if(graphicsLayer && graphicsLayer.graphics){
                        let graphics = graphicsLayer.graphics.toArray();
                        graphics.forEach(function(graphic){
                            let tab = graphic.attributes.tab;
                            if(tab == id){
                                graphic.visible = true;
                                currentGraphics.push(graphic);
                            }else {
                                graphic.visible = false;
                            }
                        });

                        // zoom to selected graphics 
                        if(currentGraphics.length){
                            view.goTo(currentGraphics);
                        }else {
                            view.goTo(graphics)
                        }
                    }
                });
            });
            // click first tab 
            $(".search-item__loader").remove();


            // hide tab container if it's only one tab
            if(tabContainer.children().length == 1){
                tabContainer.hide();
            }

        
            listContainer.find(".ex-accordion__item").on("click",function(){
                if(view && !$(this).hasClass("expanded")){
                    var x = $(this).closest("li").data("x") , y = $(this).closest("li").data("y"), title = $(this).find(".ex-accordion__item__title").text().trim();
                    // open popup and zoom 
                    view.goTo({
                        center : [parseFloat(x), parseFloat(y)],
                        zoom: initZoom
                    });
                    if(!isExEditor){
                        togglePopup([parseFloat(x), parseFloat(y)] , title);
                    }
                }else {
                    // close the pop
                    view.popup.close();
                }
            });

            // remove collapse from children if it's expreience editor 
            if(isExEditor){
                listContainer.children("li").find(".ex-accordion__item__content.collapse").each(function(){
                    $(this).removeClass("collapse");
                });
            }

            function searchLocalLocations(value){
                $(".searching-box__results__emptymsg").hide();
                var activeTab = tabContainer.find(".active").data("id");
                if(value){
                    listContainer.children().each(function(idx, child){
                        if($(child).text().toLowerCase().trim().indexOf(value.toLowerCase().trim()) != -1 && activeTab == $(child).data("tab")){
                            $(child).show();
                        } else {
                            $(child).hide();
                        }
                    });
                }else {
                    listContainer.find("[data-tab='"+activeTab+"']").show();
                }
                var visible = listContainer.children().find("> :visible").length;
                if(!visible){
                    $(".searching-box__results__emptymsg").show();
                }
            }
        
            function addPinPoint(item){
                // init map 
                if (graphicsLayer) {
                    var point ; 
                    require([
                        "esri/Graphic",
                        "esri/geometry/Point",
                        "esri/symbols/PictureMarkerSymbol"
                    ], function (Graphic, Point, PictureMarkerSymbol) {
                    
                        var geom = new Point({
                            x : parseFloat(item.x) ,
                            y : parseFloat(item.y)
                        });

                        var symbol = {
                            // url: "data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeD0iMHB4IiB5PSIwcHgiIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MTIgNTEyOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgd2lkdGg9IjUxMnB4IiBoZWlnaHQ9IjUxMnB4Ij4KPGc+Cgk8Zz4KCQk8cGF0aCBkPSJNMjU2LDBDMTUzLjc1NSwwLDcwLjU3Myw4My4xODIsNzAuNTczLDE4NS40MjZjMCwxMjYuODg4LDE2NS45MzksMzEzLjE2NywxNzMuMDA0LDMyMS4wMzUgICAgYzYuNjM2LDcuMzkxLDE4LjIyMiw3LjM3OCwyNC44NDYsMGM3LjA2NS03Ljg2OCwxNzMuMDA0LTE5NC4xNDcsMTczLjAwNC0zMjEuMDM1QzQ0MS40MjUsODMuMTgyLDM1OC4yNDQsMCwyNTYsMHogTTI1NiwyNzguNzE5ICAgIGMtNTEuNDQyLDAtOTMuMjkyLTQxLjg1MS05My4yOTItOTMuMjkzUzIwNC41NTksOTIuMTM0LDI1Niw5Mi4xMzRzOTMuMjkxLDQxLjg1MSw5My4yOTEsOTMuMjkzUzMwNy40NDEsMjc4LjcxOSwyNTYsMjc4LjcxOXoiIGZpbGw9IiMwMDAwMDAiLz4KCTwvZz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8L3N2Zz4K",
                            url : pinPointURL,
                            width: "32px",
                            height: "32px"
                        };
                        point = new Graphic({  
                            geometry: geom , 
                            symbol: new PictureMarkerSymbol(symbol),
                            visible : tabContainer.children(".active").data("id") ==  item.id, 
                            attributes: {
                                tab: item.id,
                                idx : item.idx,
                                title : item.title
                            }
                        });
                        graphicsLayer.add(point);
                    });

                }
                return point;
            }

            function addPoints(){
                listContainer.children().each(function(idx , item){
                    // add guid to item
                    // var guid  = $.guid++;
                    var itemData = {
                        idx: idx,
                        x : $(item).data("x"),
                        y : $(item).data("y"),
                        id : $(item).data("tab"),
                        title : $(item).children().find(".ex-accordion__item__title").text().trim(),
                    };
                    
                    // add guid 
                    $(item).attr("data-idx" , idx);
                    // add pin point to map 
                    if(itemData.x && itemData.y){
                        addPinPoint(itemData);
                    }
                });     

                // zoom to graphics extent 
                view.goTo(graphicsLayer.graphics.toArray());
            }

                // init map 
                require([
                    "esri/Map",
                    "esri/views/MapView",
                    "esri/layers/MapImageLayer",
                    "esri/widgets/BasemapGallery",
                    "esri/widgets/LayerList",
                    "esri/layers/GraphicsLayer",
                    "esri/widgets/Home",
                    "dojo/domReady!"
                ], function(EsriMap, MapView, MapImageLayer, BasemapGallery ,LayerList , GraphicsLayer , Home) {

                    // map 
                    map = new EsriMap({
                        basemap: "topo-vector"
                    });
                    
                    // map view
                    view = new MapView({
                        container: "mapDiv",
                        map: map,
                        center: initCenter,
                        scale: 150000,
                        zoom: 12,
                        // Disable mouse-wheel and single-touch map navigation.
                        navigation: !smartDevice ? {} : {
                            mouseWheelZoomEnabled: false,
                            browserTouchPanEnabled: false
                        }
                    });
                
                    if(smartDevice){
                        // Listen to events that have been disallowed for navigation.
                        view.on("mouse-wheel", function(e) {
                            warnUser(dictionry[lang].zoom );
                        });  

                        const pointers = new Map(); // javascript map
                        view.on("pointer-down", function(e) {
                            const pointerId = e.pointerId, 
                            pointerType = e.pointerType,
                            x = e.x,
                            y = e.y;

                            if (pointerType !== "touch") { return; }
                            pointers.set(pointerId, { x : x, y : y});
                        });
                        
                        view.on(["pointer-up", "pointer-leave"], function(e) {
                            const pointerId = e.pointerId, 
                            pointerType = e.pointerType;

                            if (pointerType !== "touch") { return; }
                                pointers.delete(pointerId);
                        });
                        
                        view.on("pointer-move", function(e) {
                        const pointerId = e.pointerId, 
                        pointerType = e.pointerType,
                        x = e.x,
                        y = e.y;

                        if (pointerType !== "touch") { return; }
                        if (pointers.size !== 1) { return; }
                        const distance = Math.sqrt(
                            Math.pow(x - pointers.get(pointerId).x, 2) +
                            Math.pow(y - pointers.get(pointerId).y, 2)
                        );
                        if (distance < 20) { return; }
                        warnUser(dictionry[lang].pan);
                        });

                        // Display a warning.
                        let timeout;
                        function warnUser(warning) {
                            const warningDiv = $(".ex-map__container__warning");
                            warningDiv.html('<div class="text-center p-2 w-100">' + warning + "</div>");
                            if (timeout) {
                                window.clearTimeout(timeout);
                            }
                            timeout = window.setTimeout(function() {
                                warningDiv.empty();
                            }, 4000);
                        }                    
                    }   
                    // var basemapGallery = new BasemapGallery({
                    //     view: view
                    // });

                    // view.ui.add(basemapGallery, {
                    //     position: rtl ? "top-left" : "top-right"
                    // });

                    // add layers to map 
                    var abudhabiLayerLight = new MapImageLayer({
                        url: "https://arcgis.sdi.abudhabi.ae/arcgis/rest/services/Pub/BaseMapEng_LightGray_WM/MapServer",
                        visible  : false,
                        title : dictionry[lang].lightmap

                    });
                    var abudhabiLayerDark = new MapImageLayer({
                        url: "https://arcgis.sdi.abudhabi.ae/arcgis/rest/services/Pub/BaseMapEng_DarkGray_WM/MapServer",
                        visible  : false,
                        title : dictionry[lang].darkmap
                    });
                    graphicsLayer = new GraphicsLayer({
                        title : "Locations",
                        graphics: [],
                        listMode : "hide" // hide from layer list to disable toggling 
                    });
                
                    
                    map.add(abudhabiLayerLight);
                    map.add(abudhabiLayerDark);
                    map.add(graphicsLayer);


                    // listen to view loaded event 
                    view.when(function(){
                        // All the resources in the MapView and the map have loaded. Now execute additional processes
                        // hide loader 
                        $(".map-loader").hide();

                        // show layer list widget 
                        var layerList = new LayerList({
                            view: view,
                            listItemCreatedFunction: function(event) {

                                // The event object contains properties of the
                                // layer in the LayerList widget.
                                var item = event.item, 
                                layer = item.layer;

                                // hide sublayers from layerlist
                                if(layer && layer.sublayers){
                                    let sublayers = layer.sublayers.get("items");
                                    if(sublayers && sublayers.length){
                                        sublayers.forEach(function(sublayer){
                                            sublayer.listMode = "hide";
                                        });
                                    }
                                }
                                // // set an action for zooming to the full extent of the layer
                                // item.actionsSections = [
                                //   [{
                                //     title: "Zoom to layer",
                                //     className: "esri-icon-zoom-out-fixed",
                                //     id: "full-extent"
                                //   }]
                                // ];
                            }
                        });

                        // Add layers widget to the top right corner of the view
                        view.ui.add(layerList,  rtl ? "top-left" : "top-right");

                        // load locations from server or CM 
                        addPoints(); 


                        // full extent
                        var homeBtn = new Home({
                            view: view
                        });
                        view.ui.add(homeBtn, "top-left");

                        
                        // // create full extens button 
                        // let button = $("<div/>" , {
                        //     "class": "esri-widget--button", 
                        //     "title" : dictionry[lang].fullExtent ,
                        // });
                        // button.append("<span class='icon-earth'> </span>");

                        // button.on("click" , function(){
                        //     if(currentGraphics && currentGraphics.length){
                        //         view.goTo(currentGraphics);
                        //     }else {
                        //         view.goTo(graphicsLayer.graphics.toArray());
                        //     }
                        // });
                        // $(".esri-component.esri-zoom.esri-widget").append(button);
                    
                        // click the tab after init 
                        tabContainer.children().first().click();

                    }, function(error){
                        // Use the errback function to handle when the view doesn't load properly
                        console.error("The view's resources failed to load: ", error);
                    });

                    view.on("click", function (event) {
                        var screenPoint = {
                        x: event.x,
                        y: event.y
                        };
                        console.info(screenPoint);

                        // Search for graphics at the clicked location
                        view.hitTest(screenPoint).then(function (response) {
                            if (response.results.length) {
                                var graphic = response.results.filter(function (result) {
                                // check if the graphic belongs to the layer of interest
                                return result.graphic.layer === graphicsLayer;
                                })[0].graphic;
                                
                                // graphic 
                                if (graphic && graphic.attributes){
                                    let tabIndex = graphic.attributes.idx;                                
                                    setTimeout(function(){
                                        $('[data-idx="'+tabIndex+'"]').find(".ex-accordion__item").click().find('[data-toggle]').click();
                                    } , 0);
                                    
                                }
                            }
                        });
                    });

                });

        
            // search input change event 
            $(".searching-box__bar input[type='text']").on("change" , function(){
                searchLocalLocations($(this).val());
            });
            $(".searching-box__bar input[type='text']").on("keyup" , function(evt){
                if(evt.keyCode === 13){
                    searchLocalLocations($(this).val());
                }
            });
            $(".searching-box__bar .icon").on("click" , function(){
                let value = $(".searching-box__bar input[type='text']").val();
                searchLocalLocations(value);            
            });
        
        }
    }else {
        // remove everything
        tabContainer.remove();
        $(".ex-map .map-loader").remove();
        $(".ex-map .searching-box").remove();

        // place error message of esri apis not loaded
        if(typeof require == "undefined"){
            mapContainer.find(".map-box").append('<div class="loading-error d-flex h-100 w-100 justify-content-center align-items-center"> Esri API\'s not loaded</div>');
        }
    }
});