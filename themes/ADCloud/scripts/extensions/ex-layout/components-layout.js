/***************************************************************************************************
Extension Name: #{$ProjectName} 
File: Layout
Owner: Wael Gomaa
Version: 1.0.0
***************************************************************************************************/

$(document).ready(function () {
	var rtl = $.checkSiteRTLDirection(),
		fileSizelabel = rtl ? "ك.ب" : "kb";
		fileSizeBytelabel = rtl ? "ب" : "b";
	function appenedFileKb() {

		$(".size.field-size").each(function () {
			if ($(this).text().indexOf(fileSizelabel) == -1) {
				if(Math.round($(this).text() / 1024)!=0){
					$(this).text(Math.round($(this).text() / 1024) + " " + fileSizelabel);
				}else if(Math.round($(this).text() / 1024)==0){
					$(this).text(parseFloat($(this).text()).toFixed(2) + " " + fileSizeBytelabel);
				}
			}
		});
	}
	appenedFileKb();

	// calculating file size
	if (typeof XA != "undefined" && XA.component.search.vent) {
		XA.component.search.vent.on("results-loaded", function () {
			appenedFileKb();
		});
	}



	// go to top handle
	let gototopbtn = $(".go-to-top");
	if (gototopbtn.length) {
		let showAfter = gototopbtn.data("showafter") || 400;

		$(window).scroll(function () {
			if (!$(".on-page-editor").length) {
				if ($(window).scrollTop() > showAfter) {
					gototopbtn.show(500);
				}
				else {
					gototopbtn.hide(500);
				}
			}
		});
		gototopbtn.on("click", function () {
			window.scrollTo({ top: 0, behavior: 'smooth' });
		});
	}

});

function removeAlert(elmnt) {
	$(elmnt).parent().remove();
}

$('[data-auto-close]').each(function () {
	var element = $(this);
	var val = $(this).data('auto-close');
	setTimeout(function () { element.remove() }, val)
});