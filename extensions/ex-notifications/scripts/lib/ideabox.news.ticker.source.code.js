
    "use strict";

    $.breakingNews = function(e, t) {
        var i = {
                effect: "scroll",
                direction: "ltr",
                height: 24,
                fontSize: "default",
                themeColor: "default",
                background: "default",
                borderWidth: 1,
                radius: 2,
                source: "html",
                rss2jsonApiKey: "",
                play: !0,
                delayTimer: 4e3,
                scrollSpeed: 5,
                stopOnHover: !0,
                position: "auto",
                zIndex: 99999
            },
            perviousItem ,
            a = this;
        a.settings = {}, a._element = $(e), a._label = a._element.children(".ex-notifications-v3-label"), a._news = a._element.children(".ex-notifications-v3-news"), a._ul = a._news.children("ul"), a._li = a._ul.children("li"), a._controls = a._element.children(".ex-notifications-v3-controls"), a._prev = a._controls.find(".ex-notifications-v3-prev").parent(), a._action = a._controls.find(".ex-notifications-v3__action").parent(), a._next = a._controls.find(".ex-notifications-v3-next").parent(), a._pause = !1, a._controlsIsActive = !0, a._totalNews = a._ul.children("li").length, a._activeNews = 0, a._interval = !1, a._frameId = null;
        var o = function() {
                if (0 < a._label.length && ("rtl" == a.settings.direction ? a._news.css({
                        right: a._label.outerWidth()
                    }) : a._news.css({
                        left: a._label.outerWidth()
                    })), 0 < a._controls.length) {
                    var e = a._controls.outerWidth();
                    "rtl" == a.settings.direction ? a._news.css({
                        left: e
                    }) : a._news.css({
                        right: e
                    })
                }
                if ("scroll" === a.settings.effect) {
                    var t = 0;
                    a._li.each(function() {
                        t += $(this).outerWidth()
                    }), t += 50, a._ul.css({
                        width: t
                    })
                }
            },
            s = function() {
                var l = new XMLHttpRequest;
                l.onreadystatechange = function() {
                    if (4 == l.readyState && 200 == l.status) {
                        var e = JSON.parse(l.responseText),
                            t = "",
                            i = "";
                        switch (a.settings.source.showingField) {
                            case "title":
                                i = "title";
                                break;
                            case "description":
                                i = "description";
                                break;
                            case "link":
                                i = "link";
                                break;
                            default:
                                i = "title"
                        }
                        var s = "";
                        void 0 !== a.settings.source.seperator && void 0 !== typeof a.settings.source.seperator && (s = a.settings.source.seperator);
                        for (var n = 0; n < e.items.length; n++) a.settings.source.linkEnabled ? t += '<li><a target="' + a.settings.source.target + '" href="' + e.items[n].link + '">' + s + e.items[n][i] + "</a></li>" : t += "<li><a>" + s + e.items[n][i] + "</a></li>";
                        a._ul.empty().append(t), a._li = a._ul.children("li"), a._totalNews = a._ul.children("li").length, o(), "scroll" != a.settings.effect && animateNews(), a._li.find(".ex-notifications-v3-seperator").css({
                            height: a.settings.height - 2 * a.settings.borderWidth
                        }), f()
                    }
                }, l.open("GET", "https://api.rss2json.com/v1/api.json?rss_url=" + a.settings.source.url + "&count=" + a.settings.source.limit + "&api_key=" + a.settings.source.rss2jsonApiKey, !0), l.send()
            },
            n = function() {
                $.getJSON(a.settings.source.url, function(e) {
                    var t = "",
                        i = "";
                    i = "undefined" === a.settings.source.showingField ? "title" : a.settings.source.showingField;
                    var s = "";
                    void 0 !== a.settings.source.seperator && void 0 !== typeof a.settings.source.seperator && (s = a.settings.source.seperator);
                    for (var n = 0; n < e.length && !(n >= a.settings.source.limit); n++) a.settings.source.linkEnabled ? t += '<li><a target="' + a.settings.source.target + '" href="' + e[n].link + '">' + s + e[n][i] + "</a></li>" : t += "<li><a>" + s + e[n][i] + "</a></li>", "undefined" === e[n][i] && console.log('"' + i + '" does not exist in this json.');
                    a._ul.empty().append(t), a._li = a._ul.children("li"), a._totalNews = a._ul.children("li").length, o(), "scroll" != a.settings.effect && animateNews(), a._li.find(".ex-notifications-v3-seperator").css({
                        height: a.settings.height - 2 * a.settings.borderWidth
                    }), f()
                })
            },
            l = function() {
                var e = parseFloat(a._ul.css("marginLeft"));
                e -= a.settings.scrollSpeed / 2, a._ul.css({
                    marginLeft: e
                }), e <= -a._ul.find("li:first-child").outerWidth() && (a._ul.find("li:first-child").insertAfter(a._ul.find("li:last-child")), a._ul.css({
                    marginLeft: 0
                })), !1 === a._pause && (a._frameId = requestAnimationFrame(l), window.requestAnimationFrame && a._frameId || setTimeout(l, 16))
            },
            r = function() {
                var e = parseFloat(a._ul.css("marginRight"));
                e -= a.settings.scrollSpeed / 2, a._ul.css({
                    marginRight: e
                }), e <= -a._ul.find("li:first-child").outerWidth() && (a._ul.find("li:first-child").insertAfter(a._ul.find("li:last-child")), a._ul.css({
                    marginRight: 0
                })), !1 === a._pause && (a._frameId = requestAnimationFrame(r)), window.requestAnimationFrame && a._frameId || setTimeout(r, 16)
            },
            scrollNxt = function() {
                "rtl" === a.settings.direction ? a._ul.stop().animate({
                    marginRight: -a._ul.find("li:first-child").outerWidth()
                }, 300, function() {
                    a._ul.find("li:first-child").insertAfter(a._ul.find("li:last-child")), a._ul.css({
                        marginRight: 0
                    }), a._controlsIsActive = !0
                }) : a._ul.stop().animate({
                    marginLeft: -a._ul.find("li:first-child").outerWidth()
                }, 300, function() {
                    a._ul.find("li:first-child").insertAfter(a._ul.find("li:last-child")), a._ul.css({
                        marginLeft: 0
                    }), a._controlsIsActive = !0
                })
            },
            scrollBigNews = function(item, interval) {
                if(!$('body').hasClass('on-page-editor')){
                    $(".news-scrolling").removeClass("news-scrolling");
                    item.addClass('news-scrolling');
                    var speed = parseInt(interval * 22);
                    interval = interval;
                    "rtl" === a.settings.direction ? item.stop().animate({
                        right: -interval
                    }, speed,  function () {
                        setTimeout(function(){
                            //item.css('right','0')
                        }, a.settings.delayTimer + 1000)
                    }) : item.stop().animate({
                        left: -interval - 20
                    }, speed, function () {
                        setTimeout(function (){
                           // item.css('left','0');
                        }, a.settings.delayTimer + 1000);
                    })
                    }
            },
            puseScrollBigNews = function() {
                $(".news-scrolling").stop();
            },
            resumeScrollBigNews = function() {
                let item = $(".news-scrolling");
                var ContainerWidth = $(a._ul).outerWidth(), 
                scrollingWidth = item.outerWidth(),
                position = "rtl" === a.settings.direction ? item.css('right'):item.css('left');

                position = parseFloat(position)
                let resumeInterval = (scrollingWidth - ContainerWidth  );
                let speed = (resumeInterval+position) * 22;
                "rtl" === a.settings.direction ? item.stop().animate({
                    right: -resumeInterval 
                },  speed,function () {
                    //item.css('right','0')
                  }) : item.stop().animate({
                    left: -resumeInterval-20
                }, speed, function () {
                    //item.css('left','0')
                  })
            },
            terminateScrollBigNews = function(item) {
                if(item) //because 1st time the item is empty
                {
                    $(".news-scrolling").removeClass("news-scrolling");
                    "rtl" === a.settings.direction ?item.css('right','0') :item.css('left','0')
                    item.stop();
                }
            },
            scrollPrev = function() {
                "rtl" === a.settings.direction ? (0 <= parseInt(a._ul.css("marginRight"), 10) && (a._ul.css({
                    "margin-right": -a._ul.find("li:last-child").outerWidth()
                }), a._ul.find("li:last-child").insertBefore(a._ul.find("li:first-child"))), a._ul.stop().animate({
                    marginRight: 0
                }, 300, function() {
                    a._controlsIsActive = !0
                })) : (0 <= parseInt(a._ul.css("marginLeft"), 10) && (a._ul.css({
                    "margin-left": -a._ul.find("li:last-child").outerWidth()
                }), a._ul.find("li:last-child").insertBefore(a._ul.find("li:first-child"))), a._ul.stop().animate({
                    marginLeft: 0
                }, 300, function() {
                    a._controlsIsActive = !0
                }))
            },
            animateNews = function() {
                var activeItem = $(a._ul.find("li").eq(a._activeNews)[0].firstElementChild),
                activeCellDataAttr = activeItem.data("label");
                if($("#data-label").text() != activeCellDataAttr)
                    $('#data-label').html(activeCellDataAttr);
            
                switch (a._controlsIsActive = !0, a.settings.effect) {
                    case "typography":
                        a._ul.find("li").hide(), a._ul.find("li").eq(a._activeNews).width(30).show(), a._ul.find("li").eq(a._activeNews).animate({
                            width: "100%",
                            opacity: 1
                        }, 1500);
                        break;
                    case "fade":
                        a._ul.find("li").hide(), a._ul.find("li").eq(a._activeNews).fadeIn();
                        break;
                    case "slide-down":
                        a._totalNews <= 1 ? a._ul.find("li").animate({
                            top: 30,
                            opacity: 0
                        }, 300, function() {
                            $(this).css({
                                top: -30,
                                opacity: 0,
                                display: "block"
                            }), $(this).animate({
                                top: 0,
                                opacity: 1
                            }, 300)
                        }) : (a._ul.find("li:visible").animate({
                            top: 30,
                            opacity: 0
                        }, 300, function() {
                            $(this).hide()
                        }), a._ul.find("li").eq(a._activeNews).css({
                            top: -30,
                            opacity: 0
                        }).show(), a._ul.find("li").eq(a._activeNews).animate({
                            top: 0,
                            opacity: 1
                        }, 300));
                        break;
                    case "slide-up":
                        a._totalNews <= 1 ? a._ul.find("li").animate({
                            top: -30,
                            opacity: 0
                        }, 300, function() {
                            $(this).css({
                                top: 30,
                                opacity: 0,
                                display: "block"
                            }), $(this).animate({
                                top: 0,
                                opacity: 1
                            }, 300)
                        }) : (a._ul.find("li:visible").animate({
                            top: -30,
                            opacity: 0
                        }, 300, function() {
                            $(this).hide()
                        }), a._ul.find("li").eq(a._activeNews).css({
                            top: 30,
                            opacity: 0
                        }).show(), a._ul.find("li").eq(a._activeNews).animate({
                            top: 0,
                            opacity: 1
                        }, 300));
                        break;
                    case "slide-left":
                        "rtl" === a.settings.direction ? a._ul.parent().css({right : a._label.outerWidth() + "px"}): a._ul.parent().css({left : a._label.outerWidth() + "px"})
                        a._totalNews <= 1 ? a._ul.find("li").animate({
                            left: "50%",
                            opacity: 0
                        }, 300, function() {
                            $(this).css({
                                left: -50,
                                opacity: 0,
                                display: "block"
                            }), $(this).animate({
                                left: 0,
                                opacity: 1
                            }, 300)
                        }) : (a._ul.find("li:visible").animate({
                            left: "50%",
                            opacity: 0
                        }, 300, function() {
                            $(this).hide()
                        }), a._ul.find("li").eq(a._activeNews).css({
                            left: -50,
                            opacity: 0
                        }).show(), a._ul.find("li").eq(a._activeNews).animate({
                            left: 0,
                            opacity: 1
                        }, 300));

             

                        break;
                    case "slide-right":
                        a._totalNews <= 1 ? a._ul.find("li").animate({
                            left: "-50%",
                            opacity: 0
                        }, 300, function() {
                            $(this).css({
                                left: "50%",
                                opacity: 0,
                                display: "block"
                            }), $(this).animate({
                                left: 0,
                                opacity: 1
                            }, 300)
                        }) : (a._ul.find("li:visible").animate({
                            left: "-50%",
                            opacity: 0
                        }, 300, function() {
                            $(this).hide()
                        }), a._ul.find("li").eq(a._activeNews).css({
                            left: "50%",
                            opacity: 0
                        }).show(), a._ul.find("li").eq(a._activeNews).animate({
                            left: 0,
                            opacity: 1
                        }, 300));
                        break;
                    default:
                        a._ul.find("li").hide(), a._ul.find("li").eq(a._activeNews).show()
                }

                // terminate scrolling 
                terminateScrollBigNews(perviousItem);
                var newsWidth = activeItem[0].scrollWidth ,
                ContainerWidth = $(a._ul).innerWidth()
                
                if(newsWidth > ContainerWidth){
                    scrollBigNews(activeItem, newsWidth - ContainerWidth)
                }
                perviousItem = activeItem;
            },
            f = function() {
                if (a._pause = !1, a.settings.play) switch (a.settings.effect) {
                    case "scroll":
                        "rtl" === a.settings.direction ? a._ul.width() > a._news.width() ? r() : a._ul.css({
                            marginRight: 0
                        }) : a._ul.width() > a._news.width() ? l() : a._ul.css({
                            marginLeft: 0
                        });
                        break;
                    default:
                        a.pause(), a._interval = setInterval(function() {
                            if (!$('.news-scrolling').is(':animated'))
                            a.next()
                        }, a.settings.delayTimer)
                }
            },
            _ = function() {
                a._element.width() < 480 ? (a._label.hide(), "rtl" == a.settings.direction ? a._news.css({
                    right: 0
                }) : a._news.css({
                    left: 0
                })) : (a._label.show(), "rtl" == a.settings.direction ? a._news.css({
                    right: a._label.outerWidth()
                }) : a._news.css({
                    left: a._label.outerWidth()
                }))
            };
        a.init = function() {
           
            if (a.settings = $.extend({}, i, t), "fixed-top" === a.settings.position ? a._element.addClass("ex-notifications-v3-fixed-top").css({
                    "z-index": a.settings.zIndex
                }) : "fixed-bottom" === a.settings.position && a._element.addClass("ex-notifications-v3-fixed-bottom").css({
                    "z-index": a.settings.zIndex
                }), "default" != a.settings.fontSize && a._element.css({
                    "font-size": a.settings.fontSize
                }), "default" != a.settings.themeColor && (a._element.css({
                    "border-color": a.settings.themeColor,
                    color: a.settings.themeColor
                }), a._label.css({
                    background: a.settings.themeColor
                })), "default" != a.settings.background && a._element.css({
                    background: a.settings.background
                }), a._element.css({
                    height: a.settings.height,
                    "line-height": a.settings.height - 2 * a.settings.borderWidth + "px",
                    "border-radius": a.settings.radius,
                    "border-width": a.settings.borderWidth
                }), a._li.find(".ex-notifications-v3-seperator").css({
                    height: a.settings.height - 2 * a.settings.borderWidth
                }), a._element.addClass("ex-notifications-v3-effect-" + a.settings.effect + " ex-notifications-v3-direction-" + a.settings.direction), o(), "object" == typeof a.settings.source) switch (a.settings.source.type) {
                case "rss":
                    "rss2json" === a.settings.source.usingApi ? (s(), 0 < a.settings.source.refreshTime && setInterval(function() {
                        a._activeNews = 0, a.pause(), a._ul.empty().append('<li style="display:block; padding-left:10px;"><span class="ex-notifications-v3-loader-text">......</span></li>'), setTimeout(function() {
                            s()
                        }, 1e3)
                    }, 1e3 * a.settings.source.refreshTime * 60)) : ((l = new XMLHttpRequest).open("GET", "https://query.yahooapis.com/v1/public/yql?q=" + encodeURIComponent('select * from rss where url="' + a.settings.source.url + '" limit ' + a.settings.source.limit) + "&format=json", !0), l.onreadystatechange = function() {
                        if (4 == l.readyState)
                            if (200 == l.status) {
                                var e = JSON.parse(l.responseText),
                                    t = "",
                                    i = "";
                                switch (a.settings.source.showingField) {
                                    case "title":
                                        i = "title";
                                        break;
                                    case "description":
                                        i = "description";
                                        break;
                                    case "link":
                                        i = "link";
                                        break;
                                    default:
                                        i = "title"
                                }
                                var s = "";
                                "undefined" != a.settings.source.seperator && void 0 !== a.settings.source.seperator && (s = a.settings.source.seperator);
                                for (var n = 0; n < e.query.results.item.length; n++) a.settings.source.linkEnabled ? t += '<li><a target="' + a.settings.source.target + '" href="' + e.query.results.item[n].link + '">' + s + e.query.results.item[n][i] + "</a></li>" : t += "<li><a>" + s + e.query.results.item[n][i] + "</a></li>";
                                a._ul.empty().append(t), a._li = a._ul.children("li"), a._totalNews = a._ul.children("li").length, o(), "scroll" != a.settings.effect && animateNews(), a._li.find(".ex-notifications-v3-seperator").css({
                                    height: a.settings.height - 2 * a.settings.borderWidth
                                }), f()
                            } else a._ul.empty().append('<li><span class="ex-notifications-v3-loader-text">' + a.settings.source.errorMsg + "</span></li>")
                    }, l.send(null));
                    break;
                case "json":
                    n(), 0 < a.settings.source.refreshTime && setInterval(function() {
                        a._activeNews = 0, a.pause(), a._ul.empty().append('<li style="display:block; padding-left:10px;"><span class="ex-notifications-v3-loader-text">......</span></li>'), setTimeout(function() {
                            n()
                        }, 1e3)
                    }, 1e3 * a.settings.source.refreshTime * 60);
                    break;
                default:
                    console.log('Please check your "source" object parameter. Incorrect Value')
            } else "html" === a.settings.source ? ("scroll" != a.settings.effect && animateNews(), f()) : console.log('Please check your "source" parameter. Incorrect Value');
            var l;
            a.settings.play ? a._action.find("span").removeClass("ex-notifications-v3__action--play").addClass("ex-notifications-v3__action--pause") : a._action.find("span").removeClass("ex-notifications-v3__action--pause").addClass("ex-notifications-v3__action--play"), 
            a._element.on("mouseleave", function(e) {
                var t = $(document.elementFromPoint(e.clientX, e.clientY)).parents(".ex-notifications-v3-breaking-news")[0];
                $(this)[0] !== t && (!0 === a.settings.stopOnHover ? !0 === a.settings.play && a.play() : !0 === a.settings.play && !0 === a._pause && a.play());
                resumeScrollBigNews();

            }), a._element.on("mouseenter", function() {
                !0 === a.settings.stopOnHover && a.pause(), puseScrollBigNews()
            }), a._next.on("click", function() {
                a._controlsIsActive && (a._controlsIsActive = !1, a.pause(), a.next())
            }), a._prev.on("click", function() {
                a._controlsIsActive && (a._controlsIsActive = !1, a.pause(), a.prev())
            }), a._action.on("click", function() {
                a._controlsIsActive && (a._action.find("span").hasClass("ex-notifications-v3__action--pause") ? (a._action.find("span").removeClass("ex-notifications-v3__action--pause").addClass("ex-notifications-v3__action--play"), a.stop()) : (a.settings.play = !0, a._action.find("span").removeClass("ex-notifications-v3__action--play").addClass("ex-notifications-v3__action--pause")))
            }), _(), $(window).on("resize", function() {
                _(), a.pause(), a.play()
            })
        }, a.pause = function() {
            a._pause = !0, clearInterval(a._interval), cancelAnimationFrame(a._frameId)
        }, a.stop = function() {
            a._pause = !0, a.settings.play = !1
        }, a.play = function() {
            if(!$('body').hasClass('on-page-editor'))
            f()
        }, a.next = function() {
            ! function() {
                switch (a.settings.effect) {
                    case "scroll":
                        scrollNxt();
                        break;
                    default:
                        a._activeNews++, a._activeNews >= a._totalNews && (a._activeNews = 0), animateNews()
                }
            }()
        }, a.prev = function() {
            ! function() {
                switch (a.settings.effect) {
                    case "scroll":
                        scrollPrev();
                        break;
                    default:
                        a._activeNews--, a._activeNews < 0 && (a._activeNews = a._totalNews - 1), animateNews()
                }
            }()
        }, a.init()
    }, $.fn.breakingNews = function(t) {
        return this.each(function() {
            if (null == $(this).data("breakingNews")) {
                var e = new $.breakingNews(this, t);
                $(this).data("breakingNews", e)
            }
        })
    }
 


