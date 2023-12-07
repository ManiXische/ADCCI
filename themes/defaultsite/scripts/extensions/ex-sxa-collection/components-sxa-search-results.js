if(typeof XA != "undefined"){
    XA.component.search.results.count = (function ($, document) {

        var api = {}, initialized = false;

        var SearchResultCountView = Backbone.View.extend({
            initialize: function(){
                var dataProperties = this.$el.data(),
                    resultsCountContainer = this.$el.find(".results-count"),
                    inst = this;

                this.resultsCountText = resultsCountContainer.html();

                //check if we're opening page from disc - if yes then we are in Creative Exchange mode so let's show fake results count
                if (window.location.href.startsWith("file://")) {
                    resultsCountContainer.html(inst.resultsCountText.replace('{count}', "<span class='font-weight-bold'>"+1+"</span>"));
                    inst.$el.find(".results-count").show();
                    return;
                } 

                XA.component.search.vent.on("results-loaded", function (data){
                    console.log("MasterSiteTheme");
                    var totalResultsCount = data.dataCount;
                    var sizeOfResultsDisplayed = 0;
                    if (data.offset == undefined || data.offset == 0) {
                        sizeOfResultsDisplayed = data.data.length;
                    }
                    else {
                        sizeOfResultsDisplayed = data.data.length + data.offset;
                    }
                    var resultsCountText = inst.resultsCountText.replace('{size}', "<span class='font-weight-bold'>"+sizeOfResultsDisplayed+"</span>" );
                    resultsCountText = resultsCountText.replace('{count}', "<span class='font-weight-bold'>"+totalResultsCount+"</span>" );
                    resultsCountContainer.html(resultsCountText);
                    if(data.dataCount > 0){					
                        inst.$el.find(".results-count").show();
                    }
                    else{
                        inst.$el.find(".results-count").hide();
                    }
                });            
            }
        });


        api.init = function () {
            if ($("body").hasClass("on-page-editor") || initialized) {
                return;
            }

            var searchResults = $(".search-results-count");
            _.each(searchResults, function (elem) {
                var searchResultsCountView = new SearchResultCountView({el: $(elem)});
            });

            initialized = true;
        };

        return api;

    }(jQuery, document));

    XA.register('searchResultsCount', XA.component.search.results.count);
}
