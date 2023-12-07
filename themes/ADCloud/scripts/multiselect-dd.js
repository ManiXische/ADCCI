

$(document).ready(function () {
	var allCheckbox = '<div class="facet-filter-all"> <p class="facet-value allChkboxP active-facet" data-facetvalue="ALL"><input type="checkbox"   id="allChkbox" name="facetValue"><label for="facetName">All <span class="facet-count" data-facetcount="0">(0)</span></label></p><div>';

	setTimeout(function () {
		$(allCheckbox).insertBefore(".facet-search-filter");
		$("#allChkbox").prop('checked', true);
	}, 1000);

	$(document).on("click", ".facet-value", function (ev) {
		if ($(this).hasClass("allChkboxP")) {
			ev.stopPropagation();
			if ($(this).children("input").is(':checked')) {
				console.log("all cheked");

				$(".facet-search-filter .facet-value").not(this).removeClass("active-facet");
				$(".facet-search-filter .facet-value").not(this).children("input").prop('checked', false);
			}
			else {
				console.log("all unchecked");
				$(".facet-search-filter .facet-value").removeClass("active-facet");
				$(".facet-search-filter .facet-value").children("input").prop('checked', false);
			}
		}
		else {
			if ($(this).children("input").is(':checked')) {
				$("#allChkbox").prop('checked', false);
				$(".allChkboxP").removeClass("active-facet");

			}
		}
	});
	$(".multi-dropdown").on("click", function () {
		$(this).toggleClass("dd-open").next().closest('.filter-by-category').slideToggle(300);
		$(this).parent().next().toggleClass('togglearrow');
	});
	$(document).click(function (e) {
		e.stopPropagation();

		if ($(event.target).closest('.ex-sxa-filter__input').length === 0) {
			$('.filter-by-category').removeClass("dd-open").slideUp(300);
			$('.dropdown-icon').removeClass("togglearrow")
		}

	});

	$(".category-filter .filter-by-category .filterButton").on("click", function (e) {
		var url = window.location.href;
		var a = url.indexOf("#");
		var b = url.substring(a);

		console.log("selected count " + $(this).parents(".filter-by-category").prev().children('.selectedCheckbox').children('.selectedCount').text())
		var selectedCheckbox = []
		var noOfcategorySelected = $('.contentContainer .facet-search-filter .facet-value.active-facet').length;



		$('.filter-by-category').removeClass("dd-open").slideUp(300);
		$('.dropdown-icon').removeClass("togglearrow")
		$('.contentContainer .facet-search-filter .facet-value').each(function () {
			console.log($(this).attr('data-facetvalue') + " <> " + $(this).hasClass('active-facet'));
			if ($(this).hasClass('active-facet')) {
				selectedCheckbox.push($(this).attr('data-facetvalue'));

			}

		});
		console.log(" selectedCheckbox  " + selectedCheckbox.length)
		$(this).parents(".filter-by-category").prev().children('.selectedCheckbox').children('.selectedCount').text(selectedCheckbox.length);
		setTimeout(function () {
			$.each(selectedCheckbox, function (index, val) {

				$('p[data-facetvalue="' + val + '"]').children('input').prop('checked', true);
				$('p[data-facetvalue="' + val + '"]').addClass("active-facet")
			});
			url.replace(b, "MK");
		}, 1000);




	});
	$(".category-filter .filter-by-category .bottom-remove-filter button").on("click", function (e) {
		//setTimeout(function () {
		var url = window.location.href;
		var a = url.indexOf("#");
		var b = url.substring(a);
		var c = url.replace(b, "");
		console.log("thr new url   " + c);
		//}, 1000);
		$('.filter-by-category').removeClass("dd-open").slideUp(300);
		$('.dropdown-icon').removeClass("togglearrow");
		$(this).parents('.facet-categoryname').prev().children('.selectedCheckbox').children(".selectedCount").text("0")
		//setTimeout(function () {$(".multi-dropdown.dd-open .selectedCheckbox .selectedCount").html("0");}, 1000);
	});

});


