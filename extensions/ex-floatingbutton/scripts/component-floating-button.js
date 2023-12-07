//bug 16760
$(document).ready(function () {
    var isTablet =  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || navigator.userAgent.match(/SAMSUNG|SGH-[I|N|T]|GT-[I|P|N]|SM-[N|P|T|Z|G]|SHV-E|SCH-[I|J|R|S]|SPH-L/i);

    if(!$(".on-page-editor").length){
        $('.ex-floatingbutton__sidenav .floating-arrow').click(function(){
            $(this).toggleClass('floating-arrow--open');
            $(this).children().toggleClass("icon-arrow-small-right").toggleClass("icon-arrow-small-left");
            $(this).next().toggleClass('floating-icon--active');
        });
    }

    if(isTablet){
        $(".ex-floatingbutton__sidenav .floating-arrow").next().removeClass('floating-icon--active');
        $(".ex-floatingbutton__sidenav .floating-arrow").children().toggleClass("icon-arrow-small-right").toggleClass("icon-arrow-small-left");
    }
});

$(window).scroll(function () {
    if(!$(".on-page-editor").length){
    if ($(window).scrollTop() > 400){
        $('.ex-floatingbutton').show(500);
    }
    else{
        $('.ex-floatingbutton').hide(500);
    }
}
});