var announcement = (function() {
  var init = function() {
          _announcementInit();
          _close();
          _AnnouncementExist();
      },
      _announcementInit = function() {
          var sections = document.querySelectorAll("header .TPN-announcement");
          if (sections) {
              [].map.call(sections, function(section) {
                  var status = _checkStatus();
                  if (status == "closed") {
                      section.parentNode.removeChild(section);
                  }
              })
          }
      },
      _checkStatus = function() {
          var status = "open";
          var prop = JSON.parse(document.querySelector("[tpn-announcement]").getAttribute("tpn-announcement"));
          var cname = _getCookie(prop.name);
          if (cname != "") {
              if (cname == prop.ID) {
                  status = "closed";
              } else {
                  status = "open";
              }
          } else {
              status = "open";
          }
          return status;
      },
      _close = function() {
          var sections = document.querySelectorAll("header .TPN-announcement");
          var body = document.body;
          if (sections) {
              [].map.call(sections, function(section) {
                  var closeBtn = section.querySelector('[TPN-announce-close]');
                  closeBtn.onclick = function(e) {
                      e.preventDefault();
                      var prop = JSON.parse(document.querySelector("[tpn-announcement]").getAttribute("tpn-announcement"));
                      _setCookie(prop.name, prop.ID, prop.date);
                      section.classList.add('remove')
                      var closeSetInterval = setInterval(function() {
                          section.parentNode.removeChild(section);
                      }, 900);
                      clearInterval(closeSetInterval);
                      body.classList.remove('TPN-announcement-inner');
                      $(body).css("padding-top", 0);
                      if ($(".tpn-sitecore-form").length > 0) {
                          if (screen.width < 992) {
                              $(body).css('padding-top', '50px');
                          } else {
                              $(body).css('padding-top', '70px');
                          }
                      }
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
          for (var i = 0; i < ca.length; i++) {
              var c = ca[i];
              while (c.charAt(0) == ' ') {
                  c = c.substring(1);
              }
              if (c.indexOf(name) == 0) {
                  return c.substring(name.length, c.length);
              }
          }
          return "";
      },
      _AnnouncementExist = function() {
          var element = document.querySelectorAll("header .TPN-announcement");
          var mobileBanner = document.querySelectorAll(".mobile-banner");
          setTimeout(function() {
              if ($(mobileBanner).is(":visible"))
                  $('body.TPN-inner-page').css('margin-top', $(mobileBanner).outerHeight());
          }, 500);
          var body = document.body;
          if (element.length > 0) {
              setTimeout(function() {
                  if (body.classList.contains("TPN-inner-page") && !window.location.href.toString().includes('SC-CSAT')) {
                      body.classList.add("TPN-announcement-inner");
                      $(body).css('padding-top', $(element).outerHeight() + 70);
                  } else if (window.location.href.toString().includes('SC-CSAT')) {
                      body.classList.add("TPN-announcement-inner");
                      $(body).css('padding-top', $(element).outerHeight());
                  } else {
                      body.classList.remove("TPN-announcement-inner");
                      $(body).css("padding-top", "0");
                  }
              }, 2000);
          } else {
              if ($(".tpn-sitecore-form").length > 0) {
                  if (screen.width < 992) {
                      $(body).css('padding-top', '50px');
                  } else {
                      $(body).css('padding-top', '70px');
                  }
              }
          }
      }
  return {
      init: init
  };
})();


jQuery().ready(function() {
  announcement.init();
});