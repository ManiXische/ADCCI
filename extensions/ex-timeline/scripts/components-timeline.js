/***************************************************************************************************
Extension Name: \\ex-timeline
File: component-timeline
Owner: null
Version: 1.0.0
***************************************************************************************************/


$(document).ready(function () {

	let isMobile =  /Android|webOS|iPhone|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) && window.matchMedia("(orientation: portrait)").matches;

    let baseClass = ".ex-timeline",
	containerTimeLine = baseClass + "__container",
	imageWrapperContainer = baseClass + "__image",
	timelineWrapper = baseClass + " .timeline-wrapper",
	navigatorWrapper = timelineWrapper + "__navigator",
	navContainer = baseClass + '__nav',
	navButton = navContainer + '__button',
	navButtonDisabled = navButton + '--disabled',
	navNext = navButton + '--next',
	navPrev = navButton + '--prev',
	contentWrapper = timelineWrapper + "__content",
    orientation = $(timelineWrapper).data("orientation") || 'vertical',
    startAt = $(timelineWrapper).data("startindex") || 1,
    arrowKeys = $(timelineWrapper).data("arrowkeys"),
    contentsSpeed = $(timelineWrapper).data("contentsspeed") || 300,
    navigatorsSpeed = $(timelineWrapper).data("navigatorsspeed") || 300;

	
    $().timelinr  && $().timelinr({
        orientation: orientation,
		// value: horizontal | vertical, default to horizontal
		containerDiv: timelineWrapper,
		// value: any HTML tag or #id, default to #timeline
		navigatorsDiv: navigatorWrapper,
		// value: any HTML tag or #id, default to #navigators
		navigatorsSelectedClass: 'selected',
		// value: any class, default to selected
		navigatorsPreviousClass: 'previous',
		// value: any class, default to previous
		imageWrapperContainer : imageWrapperContainer, 
		// value: any HTML tag or #id, default to #prev
		navigatorsSpeed: navigatorsSpeed,
		// value: integer between 100 and 1000 (recommended) or 'slow', 'normal' or 'fast'; default to normal
		contentsDiv : contentWrapper,
		// value: any HTML tag or #id, default to #contents
		contentsSelectedClass: 'selected',
		// value: any class, default to selected
		contentsSpeed: contentsSpeed,
		// value: integer between 100 and 1000 (recommended) or 'slow', 'normal' or 'fast'; default to fast
		contentsTransparency: 0.2,
		// value: integer between 0 and 1 (recommended), default to 0.2
		contentsTransparencySpeed: 500,
		// value: integer between 100 and 1000 (recommended), default to 500 (normal)
		prevButton: navPrev,
		// value: any HTML tag or #id, default to #prev
		nextButton: navNext,
		// value: any HTML tag or #id, default to #next
		disabledButtonClass: navButtonDisabled.replace("." , ""),     
		// value: any class, default to previous
		arrowKeys: arrowKeys,
		// value: true/false, default to false
		startAt: startAt,
		// value: integer, default to 1 (first)
		autoPlay: false,
		// value: true | false, default to false
		autoPlayDirection: 'forward',
		// value: forward | backward, default to forward
		autoPlayPause: 2000,
		// value: integer (1000 = 1 seg), default to 2000 (2segs)< 
		displayedItems: 6,
		// according to UI view 
    });

});