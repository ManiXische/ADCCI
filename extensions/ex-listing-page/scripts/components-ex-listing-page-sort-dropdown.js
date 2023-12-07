function getListItems(dropdownElement) {
  /* this function extracts the label and values of SELECT element inside the custom dropdown element
      it receives the custom dropdown element and returns an array of object each object contain the lang name and the like of pdf  */
  var Items = [];

  var childNodesOfDropdown = dropdownElement.childNodes;
  for (
    var childIndex = 0;
    childIndex < childNodesOfDropdown.length;
    childIndex++
  ) {
    if (childNodesOfDropdown[childIndex].nodeName === "SELECT") {
      var childNodesOfSelect = childNodesOfDropdown[childIndex].childNodes;
      for (
        var optionIndex = 0;
        optionIndex < childNodesOfSelect.length;
        optionIndex++
      ) {
        if (childNodesOfSelect[optionIndex].nodeName === "OPTION") {
          //get attributes on option
          var attrs = [];
          for (var property in childNodesOfSelect[optionIndex].attributes) {
            var attr = childNodesOfSelect[optionIndex].attributes[property];
            if (typeof attr == "object") {
              attrs.push({ name: attr.name, value: attr.value });
            }
          }

          Items.push({
            name: childNodesOfSelect[optionIndex].label,
            link: childNodesOfSelect[optionIndex].value,
            attrs: attrs,
          });
        }
      }
      return Items;
    }
  }
}

$("document").ready(function () {
  // if ( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/.test(navigator.userAgent.toLowerCase()) ){
  //   var sortWrap = document.querySelector('[listing_soting__wrap]');
  //   var sortWrapCloned = sortWrap.cloneNode(true);
  //   sortWrap.parentNode.removeChild(sortWrap);
  //   var mobileSortWrap = document.querySelector('[mobileSOrtWrapGoesHere....]');
  //   mobileSortWrap.appendChild(sortWrapCloned);
  // }

  var customSelects = document.querySelectorAll(
    ".ex-listing-page__sort--dropdown"
  );

  for (var i = 0; i < customSelects.length; i++) {
    var sortList = document.createElement("div");
    sortList.classList.add(
      "ex-listing-page__sort--dropdown--list",
      "w-100"
    );

    customSelects[i].appendChild(sortList);

    var sortItems = getListItems(customSelects[i]);

    for (var itemIndex = 0; itemIndex < sortItems.length; itemIndex++) {
      var link = document.createElement("A");
      link.classList.add(
        "ex-listing-page__sort--dropdown--list-item-text",
        "stretched-link"
      );
      link.setAttribute("href", "javascript:void(0)");


      // sortItems[itemIndex].attrs.forEach(element => {
      //   link.setAttribute(element.name, element.value);
      // });
      var sortItemsAttrs = sortItems[itemIndex].attrs;
      for (var AttI = 0; AttI < sortItemsAttrs.length; AttI++) {
        link.setAttribute(sortItemsAttrs[AttI].name, sortItemsAttrs[AttI].value);
      }

      link.textContent = sortItems[itemIndex].name;
      var listItem = document.createElement("div");
      listItem.classList.add(
        "ex-listing-page__sort--dropdown--list-item",
        "position-relative"
      );
      listItem.appendChild(link);
      sortList.appendChild(listItem);
    }
  }
});

$("document").ready(function () {
  $(".ex-listing-page__sort--dropdown").click(function () {
    if ($(this).hasClass("active")) {
      $(".ex-listing-page__sort--dropdown").removeClass("active");
      $(".ex-listing-page__sort--dropdown--list").slideUp(100);
    } else {
      $(".ex-listing-page__sort--dropdown").removeClass("active");
      $(".ex-listing-page__sort--dropdown--list").slideUp(100);
      $(this).addClass("active");
      $(".active .ex-listing-page__sort--dropdown--list").slideDown(100);
    }
  });

  $(document).on("click", function (e) {
    if ($(e.target).parents(".ex-listing-page__sort--dropdown").length === 0) {
      $(".ex-listing-page__sort--dropdown--list").slideUp(100);
      $(".ex-listing-page__sort--dropdown").removeClass("active");
    }
  });
});

$("document").ready(function () {
  $(".ex-listing-page__sort--dropdown--list-item-text").click(function () {
    // console.log($(this).parent())
    $(this)
      .parents(".ex-listing-page__sort--dropdown")
      .children(".dropdown-link")
      .children(".ex-listing-page__sort--dropdown--text")
      .text($(this).text());
  });
});
