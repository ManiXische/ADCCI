
 $(document).ready(function(){
    var editorMode = $(".on-page-editor").length;

    function getLineNo(element){
        var nooflines = 1;
        var prefix = "truncate-";

        if($(element).is('[class*="'+prefix+'"]')){
            var list = $(element).attr("class").split(" ");
            for (var index = 0; index < list.length; index++) {
                const cssClass = list[index];
                if(cssClass.indexOf(prefix) != -1){
                    nooflines = cssClass.split(prefix)[1];
                    break;
                }    
            }
        }
        return parseInt(nooflines);
    }

    $.fn.truncate = function () {
        var lines =  getLineNo(this) ; // number of lines to show

        lines = typeof lines !== 'undefined' ? lines : 1;
        var lineHeight = $(this).css("line-height").replace("px", "");
        if(lineHeight == "normal"){
            lineHeight = $(this).css("font-size").replace("px", "");
        }
        // backup the title
        if (this.attr('title')) {
            this.text(this.attr('title'));
        }

        var textHeight = Math.ceil(lines * lineHeight);

        if (this.height() > textHeight) {
          if (!this.attr("title")) {
            this.attr("title", this.html());
          }
          var words = this.attr("title").split(" ");
          var str = "";
          var prevstr = "";
          this.text("");
          for (var i = 0; i < words.length; i++) {
            if (this.height() > textHeight) {
              this.html(prevstr.trim() + "&hellip; " );
              break;
            }
            prevstr = str;
            str += words[i] + " ";
            this.html(str.trim() + "&hellip;" );
          }
          if (this.height() > textHeight) {
            this.html(prevstr.trim() + "&hellip; " );
          }
        }
        return this;
    }

    function initTruncate(parent){
        var elements = $(".truncate");

        if(parent){
            elements = $(parent).find(".truncate");
        }

        elements.each(function() {
            // only truncate if the text is longer than the desired size; if not, skip it
            if(!editorMode || (editorMode && !$(this).hasClass("truncateless-on-editor"))){
                $(this).truncate();
            }
        });
        $( window ).trigger( "truncate-done" );
    }

    $(window).on('resize', function() {
        initTruncate();
    });

    if(typeof XA != "undefined" && XA.component.search.vent){
        XA.component.search.vent.on("results-loaded", function () {
            initTruncate();
        });
    }

    // listen to truncate event
    $(window).on( "run-truncate", function(evt,  elements){
        initTruncate(elements);
    });


    // on page load 
    initTruncate();


});
