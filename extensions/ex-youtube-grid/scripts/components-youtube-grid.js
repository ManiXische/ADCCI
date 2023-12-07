/***************************************************************************************************
Extension Name: \\ex-youtube-grid
File: component-youtube-grid
Owner: null
Version: 1.0.0
***************************************************************************************************/

$(document).ready(function(){
    var thumbnailTemplate = '<div class="ex-media-grid__body__item media-grid-item media-grid-item--video videos"> <a href="https://www.youtube.com/watch?v=[videoid]" class="stretched-link" data-caption="[caption]" > <i class="media-grid-item__icon icon-play" ></i> <img class="lazyload" data-sizes="auto" data-src="[thumbnail]"  /> </a> </div>';
    var videoGallery = $('.ex-media-grid--video-gallery');
  // function loadYoutube(){
    var grid;
      if(typeof youtTubeListURL != "undefined" && youtTubeListURL){
        $.get(youtTubeListURL,
        function(youtubeVideoList){
          if(youtubeVideoList && youtubeVideoList.items && youtubeVideoList.items.length > 0){
              grid = videoGallery.data("isotope");
              for(i = 0; i < youtubeVideoList.items.length; i++){
                  var video = youtubeVideoList.items[i];
                  var date = video.snippet.publishedAt.substring(0, video.snippet.publishedAt.indexOf('T'));
                  var thumb = $(thumbnailTemplate
                  .replace("[index]", i)
                  .replace("[videoid]", (video.id && video.id.videoId))
                  .replace("[thumbnail]", video.snippet.thumbnails.high.url)
                  .replace("[caption]", "<h4 class='truncate truncate-1'>"+video.snippet.title+"</h4> <div>"+date+"</div>"));
                  videoGallery.append(thumb);
                  grid.appended(thumb);
                  grid.layout();

                  grid.on( 'arrangeComplete', function( event, filteredItems ) {
                      $(".ex-media-grid__loadmore").removeClass("d-none");
                  });    
              }

              setTimeout(function() {
                  grid.layout();
              }, 3000);

          }else {
              videoGallery.parents(".ex-media-grid").remove();
          }
        });
      }else {
          videoGallery.parents(".ex-media-grid").remove();
      }
  // }

  // videoGallery.on("grid-loaded" , loadYoutube);
  // document.addEventListener("grid-loaded", loadYoutube);

    $(window).scroll(function(){
        grid && grid.layout();
    });

});

