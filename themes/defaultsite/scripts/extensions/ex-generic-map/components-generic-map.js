/***************************************************************************************************
Extension Name: \\ex-generic-map
File: component-map
Owner: Wael Gomaa
Version: 1.0.0
***************************************************************************************************/


$(document).ready(function () {
    var mapDivID = "genericMapDiv";
    let tabContainer = $(".ex-generic-map__tabs");
    let mapContainer = $(".ex-generic-map");
    let map,view;
    let rtl = $.checkSiteRTLDirection();
    let smartDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    function toggleLayer(index){
        if(typeof esriMaplist != "undefined" && esriMaplist.length && esriMaplist[index]){
            map.layers.forEach(function(lyr,idx){
                if(idx == index){
                    lyr.visible = true;
                }else {
                    lyr.visible = false;
                }
            });

            // zoom to layer 
            view.goTo({
                center :[esriMaplist[index].CenterLong , esriMaplist[index].CenterLat],
                // zoom: esriMaplist[index].Scale
            });

            // change scale
            view.scale = esriMaplist[index].Scale;

            // change basemap 
            var basemapDiv = $("[data-basemap-id='"+ esriMaplist[index].Basemap +"']");
            if(basemapDiv.length){
                basemapDiv[0].click();
            }
        }
    }
    // check if map is exists & esri api has been loaded & data list is not empty
    if(typeof require != "undefined"){

        if(document.getElementById(mapDivID)){

            // Hoisted variables
            var lang = $("html").attr("lang").toLowerCase();

            // activate tabs 
            tabContainer.children("li").each(function(idx , tab){
                $(tab).on("click", function(){

                    tabContainer.children().removeClass("active");
                    $(this).addClass("active");

                    // toggle layers 
                    var index = $(this).data("index")
                    toggleLayer(index);
                });
            });
            // click first tab 
            $(".search-item__loader").remove();

            // hide tab container if it's only one tab
            if(tabContainer.children().length == 1 || !(typeof esriMaplist != "undefined" && esriMaplist.length)){
                tabContainer.hide();
            }

            // init map 
            require([
                "esri/Map",
                "esri/views/MapView",
                "esri/layers/MapImageLayer",
                "esri/widgets/Home",
                "esri/widgets/BasemapToggle",
                "dojo/domReady!"
            ], function(EsriMap, MapView, MapImageLayer ,Home, BasemapToggle) {


            function getBaseMap(){
                if(typeof esriMaplist != "undefined" && esriMaplist.length){
                    return esriMaplist[0].Basemap
                }
            }
            function getInitialScale (){
                if(typeof esriMaplist != "undefined" && esriMaplist.length){
                    return esriMaplist[0].Scale
                }
            }
            function getInitialCenter (){
                if(typeof esriMaplist != "undefined" && esriMaplist.length){
                    return [esriMaplist[0].CenterLong , esriMaplist[0].CenterLat];
                }
            }
            function getLayersAndBaseMaps (){
                var layers = [];

                if(typeof esriMaplist != "undefined" && esriMaplist.length){

                for(var i = 0 ; i < esriMaplist.length ; i++){

                    let jsonLayer = esriMaplist[i];

                    if(jsonLayer.LayerUrl){
                        var sublayers = jsonLayer.SubLayerIds && jsonLayer.SubLayerIds.split(",").map(function(id , idx){
                            return  {
                                id: id,
                                visible: true
                            };
                        });
                        var layerUrl = jsonLayer.LayerUrl,
                            layer = new MapImageLayer(layerUrl, {
                                sublayers: sublayers
                            });
                        layers.push(layer);
                    }

                    // add basemap toggle for this layer
                    var basemapToggle = new BasemapToggle({
                        view: view,
                        nextBasemap: jsonLayer.Basemap
                    });
                    view.ui.add(basemapToggle, "bottom-right");


                }
            }
                return layers;
            }
                // map 
                map = new EsriMap({
                    basemap: getBaseMap() || "streets"
                });
                view = new MapView({
                    container: mapDivID,
                    map: map,
                    center: getInitialCenter() || [54.38, 24.45],
                    // zoom: 12,
                    scale: getInitialScale() || 300000,
                    // Disable mouse-wheel and single-touch map navigation.
                    navigation: !smartDevice ? {} : {
                        mouseWheelZoomEnabled: false,
                        browserTouchPanEnabled: false
                    }
                });
                var homeBtn = new Home({
                    view: view
                });
                view.ui.add(homeBtn, rtl ? "top-right" : "top-left");

                view.when(function(){
                    // All the resources in the MapView and the map have loaded. Now execute additional processes
                    // hide loader 
                    $(".map-loader").hide();
                });
            
                if(smartDevice){
                    // Listen to events that have been disallowed for navigation.
                    view.on("mouse-wheel", function(e) {
                        // should warn the user 
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
                    });                                     
                }   

                var layers = getLayersAndBaseMaps() || [];
                map.layers.addMany(layers);

                // click the tab after init 
                tabContainer.children().first().click();

            });

        
          
        }
    }else {
        // remove everything
        tabContainer.remove();
        $(".ex-generic-map .map-loader").remove();

        // place error message of esri apis not loaded
        if(typeof require == "undefined"){
            mapContainer.find(".map-box").append('<div class="loading-error d-flex h-100 w-100 justify-content-center align-items-center"> Esri API\'s not loaded</div>');
        }
    }
});


