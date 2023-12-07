
// Burger Menu 
// =====================================
$( document ).ready(function() {

    var burgerMenu = $("#sidebar");
    burgerMenu.addClass("expanding-navigation");
    var submenus = burgerMenu.find(".submenu");

    
    // append icon 
    submenus.each(function(){
        var menu = $(this).find("> ul");
        var title = $(this).find("> .navigation-title");
        var expand = $("<i>", {
            "class": "icon-chevron-down expand-icon font-weight-bold",
            "click" : function(e){
                e.preventDefault();
                
                // collapse all 
                var parents = $(this).parents("ul.expanded-menu"),
                parentHeight = 0; 
                parents.each(function(idx , parent){
                    parentHeight += $(parent).outerHeight();
                });

                $(".expanded-menu").not(menu).not($(this).parents("ul")).removeClass("expanded-menu").height("0px");
                $(".toggled").not(this).not($(this).parents(".toggled")).removeClass("toggled");

                $(this).toggleClass("toggled");
                var links = $(this).closest(".submenu").find("> ul > li");
                var height = 0;
                links.each(function (index, ele) {
                    height += $(ele).outerHeight();
                })
                
                if(menu.hasClass('expanded-menu')){
                    menu.removeClass("expanded-menu").height("0px");
                    if(parents.length){
                        var links = $(parents).find("> li");
                        var fstLink = links.first()
                        var height = links.length * fstLink.outerHeight();
                        parents.height(height + "px");
                    }
                }else {
                    menu.addClass("expanded-menu").height(height + "px");
                }

                if(parents.length){
                    parents.height((height + fstLink.outerHeight()) + "px");
                }
            }
        });
        expand.prependTo(title);
    });

    submenus.append();
  
});