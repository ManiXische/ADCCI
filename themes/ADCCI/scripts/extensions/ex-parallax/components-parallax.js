/***************************************************************************************************
Extension Name: \\ex-parallax
File: component-parallax
Owner: null
Version: 1.0.0
***************************************************************************************************/


$(document).ready(function () {

    // animatation effect 
    function parallaxIt(e, target, movement) {
        var $this = $(".ex-parallax--animation, .section--animation");
        var relX = e.pageX - $this.offset().left;
        var relY = e.pageY - $this.offset().top;
        TweenMax.to(target, 1, {
            x: (relX - $this.width() / 2) / $this.width() * movement,
            y: (relY - $this.height() / 2) / $this.height() * movement
        });
    }

    $(".ex-parallax--animation, .section--animation").mousemove(function(e) {
        $(this).find("> div").addClass("sliding-div");
        parallaxIt(e, ".sliding-div", -100);
    });


    calclatingBgHeight();

    // calclating the bg effect height
    function calclatingBgHeight(){ 
    $(".section--bg-effect").each(function(){
		let parent = $(this).parent();
        let item = parent.find('.section--bg-effect-item')[0];
        if(item)
		{
            let height = $(item).offset().top  + $(item).outerHeight() - $(parent).offset().top;
            $(this).height(height);
        }
    });
    }

$(window).resize(calclatingBgHeight) 

});