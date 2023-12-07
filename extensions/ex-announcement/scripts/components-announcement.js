/***************************************************************************************************
Extension Name: \\ex-announcement
File: component-announcement
Owner: null
Version: 1.0.0
***************************************************************************************************/

var announcement = (function () {
    var init = function () {
        _announcementInit();
        _close();
    },
        _announcementInit = function () {
            var sections = document.querySelectorAll("header .ex-announcement");
            if (sections) {
                [].map.call(sections , function(section){
                    var status = _checkStatus();
                    if(status == "closed"){
                        section.parentNode.removeChild(section);
                    }
                })
            }
        },
        _checkStatus = function () {
            var status = "open";
            var prop = JSON.parse(document.querySelector("[ex-announcement]").getAttribute("ex-announcement"));
            var cname = _getCookie(prop.name);
            if (cname != "") {
                if(cname == prop.ID){
                    status = "closed";
                }else{
                    status = "open";
                    $('body').addClass('announcement-visible');
                    $( window ).trigger( "announcement-visible" );
                }
            } else {
                status = "open";
                $('body').addClass('announcement-visible');
                $( window ).trigger( "announcement-visible" );
            }
            return status;
        },
        _close = function () {  
            var sections = document.querySelectorAll("header .ex-announcement");
            var body = document.body;
            if (sections) {
                [].map.call(sections , function(section){
                    var closeBtn = section.querySelector('[ex-announcement-close]');
                    closeBtn.onclick = function(e){
                        e.preventDefault();
                        $( window ).trigger( "announcement-closing");
                        var prop = JSON.parse(document.querySelector("[ex-announcement]").getAttribute("ex-announcement"));
                        _setCookie(prop.name, prop.ID, prop.date);
                        section.classList.add('remove')
                        setTimeout(function(){
                          $( window ).trigger( "announcement-invisible" );
                            $('body').removeClass('announcement-visible')
                        },800);
                    }
                })
            } 
            
        },
        _setCookie = function(cname, cvalue, exdays) {
            var expires = "";
            if (exdays) {
                var d = new Date();
                d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
                expires = "expires=" + d.toGMTString();
            }
            document.cookie = cname + "=" + cvalue + ";" + expires + "; path=/";
        },
        _getCookie = function(cname) {
            var name = cname + "=";
            var ca = document.cookie.split(';');
            for(var i = 0; i <ca.length; i++) {
              var c = ca[i];
              while (c.charAt(0) == ' ') {
                c = c.substring(1);
              }
              if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
              }
            }
            return "";
        }
    return {
        init: init
    };
})();


jQuery().ready(function () {
    announcement.init();
});