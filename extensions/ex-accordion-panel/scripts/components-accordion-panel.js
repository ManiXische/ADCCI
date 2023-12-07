/***************************************************************************************************
Extension Name: \\ex-accordion-panel
File: component-accordion-panel
Owner: Rijin Mk
Version: 1.0.0
***************************************************************************************************/

function opened(thisParent) {
  $(".ex-accordion-panel .card").removeClass("opened");
  thisParent.addClass("opened");
}

$(".ex-accordion-panel .card .card-header .btn.btn-link").click(function () {
  // For adding functionality when the card is open.

  var thisParent = $(this).parentsUntil(
    ".ex-accordion-panel .accordion",
    ".card"
  );
  !thisParent.hasClass("opened")
    ? opened(thisParent)
    : thisParent.removeClass("opened");

  // For changing the image.
  var image_id = $(this)
    .data("target")
    .replace(/collapse/gi, "image");
  $(".ex-accordion-panel__image-section > div").removeClass("selected");
  $(`${image_id}`).addClass("selected");
});

var multiImgWrapper = $(".ex-accordion-panel__multi-images"),
  fImg = $(".ex-accordion-panel__full-image"),
  mImgs = multiImgWrapper.find(".ex-accordion-panel__multi-img-wrap"),
  mImgArray = [],
  mImgArraySelected,
  index,
  mImgId,
  accordionClick = $(".ex-accordion-panel_accordion .card-header .btn"),
  accordionParent = $(".ex-accordion-panel_accordion .card");

for (var i = 0; i < mImgs.length; i++) {
  mImgs.eq(i).attr("data-id", i);
  mImgArray.push(mImgs[i].style.backgroundImage);
  if (i === 0) {
    fImg.css("background-image", mImgs.eq(i).css("background-image"));
    mImgs.eq(i).hide();
  }
}

accordionClick.on("click", function () {
  index = $(this).parents(".card").index();
  if (index == fImg.data("id")) {
    return;
  }
  fImg.fadeOut(0);
  fImg.css("background-image", "");
  fImg.css("background-image", mImgs.eq(index).css("background-image"));
  fImg.fadeIn();
  mImgs.show();
  mImgs.eq(index).hide();
});

mImgs.on("click", function () {
  mImgId = $(this).data("id");
  accordionParent.eq(mImgId).find(".btn").click();
});
