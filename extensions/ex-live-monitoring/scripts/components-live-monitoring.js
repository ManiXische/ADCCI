/***************************************************************************************************
Extension Name: \\ex-live-monitoring
File: component-live-monitoring
Owner: null
Version: 1.0.0
***************************************************************************************************/


$(document).ready(function () {
    var extensionCssClass = "ex-live-monitoring",
    mapID = "live-monitoring-map",
    selectSelector = "." + extensionCssClass + "__data__select select",
    tableSelector = "." + extensionCssClass + "__data__table table";
    
    var baseURL = (typeof listingApiURL != "undefined" && listingApiURL) ? listingApiURL.split("api/")[0] : "";

    var mapDiv = document.getElementById(mapID);

    $(selectSelector).on("change", function () {
        var selStation = $(this).val();
        getStation(selStation); // loading live data on station change
        // drawTable(rows[Math.floor(Math.random() * rows.length)]); // to be removed 
    });


    loadStations();

    var selectedStation;

    function loadStations(){
        if($("." + extensionCssClass).length){
            // to be uncommented 
            $.getJSON(listingApiURL, function (data) {
                if(data){
                    loadSelect(data);
                    loadMap(data);
                }
            // to be uncommented
            });
        }
    }
    
    function loadSelect(data){
        data.forEach(function (tval, index) {
            $(selectSelector).append("<option "+ (index == 0 && "selected") +" value='"+ tval.StationID+"'>"+ tval.StationName +"</option>");
        });
        
        // select first one 

        // init custom dropdown 
        $(".ex-live-monitoring__data__select").initCustomDropdown().addClass("ex-sitecore-form__input--custom-dropdown").show();
        
        // load first details
        var selStation = $(selectSelector).val();
        getStation(selStation);
        
        // drawTable(rows[Math.floor(Math.random() * rows.length)]); // to be removed 
    }

    function loadMap(data){
        if(mapDiv){
            require([
                "esri/Map",
                "esri/views/MapView",
                "esri/Graphic",
                "esri/layers/GraphicsLayer",
                "esri/symbols/TextSymbol",
                "esri/symbols/PictureMarkerSymbol",
                "esri/geometry/Point",
                "esri/symbols/Font"
        
            ], function (
                Map, MapView, Graphic, GraphicsLayer, TextSymbol, PictureMarkerSymbol, Point, Font
            ) {
        
                var graphicsLayer = new GraphicsLayer({ id: "myGraphics" });
        
                var map = new Map({
                    basemap: "hybrid",
                    showLabels: true
                });
        
                map.layers.addMany([graphicsLayer]);
        
                var view = new MapView({
                    center: [53, 24.6],
                    container: mapID,
                    map: map,
                    zoom: 8.4
                });
        
                // First create a point geometry (this is the location of the Titanic)
        
                // ------------------------------------------------
                // Loading Stations List from database for Map
        
                    (data && data.length) && data.forEach(function (tval, index) {
                        //var point = { type: "point", longitude: 54.852, latitude: 24.889 };
                        //var point = { type: "point", tval: lon, tval: lat };
                        var point = {
                            type: "point",
                            longitude: tval.StationLongititude,
                            latitude: tval.StationLatitude
                        };
        
                        var pictureMarkerSymbol = new PictureMarkerSymbol(DefaultPinpoint, 17, 20);

                        if (tval.StationType == "TIDE" & TidePinpoint) {
                            pictureMarkerSymbol = new PictureMarkerSymbol(TidePinpoint, 17, 20);
                        }
                        else if (tval.StationType == "BUOY" && BuoyPinpoint) {
                            pictureMarkerSymbol = new PictureMarkerSymbol(BuoyPinpoint, 17, 20);
                        }
                        
                        var lineAtt = {
                            Name: tval.StationName,
                            Latitude: tval.StationLatitude,
                            Longitude: tval.StationLongititude,
                            Type: tval.StationType
                        };
        
                        var pointGraphic = new Graphic(
                            {
                                geometry: point,
                                symbol: pictureMarkerSymbol,
                                attributes: lineAtt,
                                popupTemplate: { // autocasts as new PopupTemplate()
                                    title: "{Name}",
                                    content: [{
                                        type: "fields",
                                        fieldInfos: [{
                                            fieldName: "Name"
                                        }, {
                                            fieldName: "Latitude"
                                        }, {
                                            fieldName: "Longitude"
                                        }, {
                                            fieldName: "Type"
                                        }]
                                    }]
                                }
                            }
                        );
        
                        var textSymbol = {
                            type: "text",  // autocasts as new TextSymbol()
                            color: "white",
                            haloColor: "black",
                            haloSize: "1px",
                            text: tval.StationName,
                            xoffset: 3,
                            yoffset: 15,
                            font: {  // autocast as new Font()
                                size: 10,
                                family: "sans-serif",
                                weight: "normal"
                            }
                        };
        
                        var g2 = new Graphic({
                            geometry: point,
                            symbol: textSymbol
                        });
                        graphicsLayer.graphics.add(g2);
        
        
                        view.graphics.add(pointGraphic);
                    });
        
                // Loading Stations List from database for Map
                // -----------------------------------------------
                view.on("click", function (event) {
                    view.hitTest(event)
                        .then(function (response) {
                            $(mapDiv).trigger("map-clicked", [response.results[0].graphic]);
                        });
                });
            });
        }
    }

    function drawTable(rows){
        $(tableSelector).empty(); // Clear the table body.
        $.each(rows, function (key, val) {
            var imgPath = val.ImagePath;
            if(!imgPath.startsWith("http") && !imgPath.startsWith("wwww.")){
                imgPath = baseURL + val.ImagePath;
            }
            var row = "<tr> <td class='text-center'> <img style='width:24px;' src='"+ imgPath +"'> </td> <td class='text-left'>"+val.ParameterName+"</td> <td class='font-weight-boldest text-nowrap text-left'>" + val.LatestValue + ' ' + val.Unit +"</td> </tr>";
            $(row).appendTo($(tableSelector));
        });
    }

    function getStation(stationID) {
        if(stationID && detailsApiURL){
            $.ajax({
                url: detailsApiURL + "?StationID=" + stationID,
                type: 'GET',
                dataType: 'json',
                success: function (data) {
                    // Loop through the list of products.
                    if(data){
                        drawTable(data);
                    }
                }
            });
        }


        var today = new Date();
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        var time = today.getHours() + ":" + today.getMinutes();// + ":" + today.getSeconds();
        var CurrentDateTime = date + ' ' + time;
    }

    // listen to map click and change the select 
    $(mapDiv).on("map-clicked" , function(evt , graphic){
        selectedStation  = graphic.attributes["Name"]; 
        var stationddl = $('.ex-live-monitoring__data__select').find(".custom-dropdown-items , select");
        stationddl.each(function () {
            for (var i = 0; i < $(this).children().length; i++) {
                var option = $(this).children()[i];
                if ($(option).text().trim().toLocaleLowerCase() == selectedStation.trim().toLocaleLowerCase()) {
                    option.selected = true;
                    $(this).change();
                    $(option).click();
                }
            }
        });
    });
});