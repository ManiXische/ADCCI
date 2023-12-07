'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function timeline(collection, options) {
  var timelines = [];
  var warningLabel = 'Timeline:';
  var winWidth = window.innerWidth;
  var resizeTimer = void 0;
  var currentIndex = 0;
  // Set default settings
  var defaultSettings = {
    forceVerticalMode: {
      type: 'integer',
      defaultValue: 600
    },
    horizontalStartPosition: {
      type: 'string',
      acceptedValues: ['bottom', 'top'],
      defaultValue: 'top'
    },
    mode: {
      type: 'string',
      acceptedValues: ['horizontal', 'vertical'],
      defaultValue: 'vertical'
    },
    moveItems: {
      type: 'integer',
      defaultValue: 1
    },
    rtlMode: {
      type: 'boolean',
      acceptedValues: [true, false],
      defaultValue: false
    },
    startIndex: {
      type: 'integer',
      defaultValue: 0
    },
    verticalStartPosition: {
      type: 'string',
      acceptedValues: ['left', 'right'],
      defaultValue: 'left'
    },
    verticalTrigger: {
      type: 'string',
      defaultValue: '15%'
    },
    visibleItems: {
      type: 'integer',
      defaultValue: 3
    }
  };

  // Helper function to test whether values are an integer
  function testValues(value, settingName) {
    if (typeof value !== 'number' && value % 1 !== 0) {
      console.warn(warningLabel + ' The value "' + value + '" entered for the setting "' + settingName + '" is not an integer.');
      return false;
    }
    return true;
  }

  // Helper function to wrap an element in another HTML element
  function itemWrap(el, wrapper, classes) {
    wrapper.classList.add(classes);
    el.parentNode.insertBefore(wrapper, el);
    wrapper.appendChild(el);
  }

  // Helper function to wrap each element in a group with other HTML elements
  function wrapElements(items) {
    items.forEach(function (item) {
      itemWrap(item.querySelector('.timeline__content'), document.createElement('div'), 'timeline__content__wrap');
      itemWrap(item.querySelector('.timeline__content__wrap'), document.createElement('div'), 'timeline__item__inner');
    });
  }

  // Helper function to check if an element is partially in the viewport
  function isElementInViewport(el, triggerPosition) {
    var rect = el.getBoundingClientRect();
    var windowHeight = window.innerHeight || document.documentElement.clientHeight;
    var defaultTrigger = defaultSettings.verticalTrigger.defaultValue.match(/(\d*\.?\d*)(.*)/);
    var triggerUnit = triggerPosition.unit;
    var triggerValue = triggerPosition.value;
    var trigger = windowHeight;
    if (triggerUnit === 'px' && triggerValue >= windowHeight) {
      console.warn('The value entered for the setting "verticalTrigger" is larger than the window height. The default value will be used instead.');

      var _defaultTrigger = _slicedToArray(defaultTrigger, 3);

      triggerValue = _defaultTrigger[1];
      triggerUnit = _defaultTrigger[2];
    }
    if (triggerUnit === 'px') {
      trigger = parseInt(trigger - triggerValue, 10);
    } else if (triggerUnit === '%') {
      trigger = parseInt(trigger * ((100 - triggerValue) / 100), 10);
    }
    return rect.top <= trigger && rect.left <= (window.innerWidth || document.documentElement.clientWidth) && rect.top + rect.height >= 0 && rect.left + rect.width >= 0;
  }

  // Helper function to add transform styles
  function addTransforms(el, transform) {
    el.style.webkitTransform = transform;
    el.style.msTransform = transform;
    el.style.transform = transform;
  }

  // Create timelines
  function createTimelines(timelineEl) {
    var timelineName = timelineEl.id ? '#' + timelineEl.id : '.' + timelineEl.className;
    var errorPart = 'could not be found as a direct descendant of';
    var data = timelineEl.dataset;
    var wrap = void 0;
    var scroller = void 0;
    var items = void 0;
    var settings = {};

    // Test for correct HTML structure
    try {
      wrap = timelineEl.querySelector('.timeline__wrap');
      if (!wrap) {
        throw new Error(warningLabel + ' .timeline__wrap ' + errorPart + ' ' + timelineName);
      } else {
        scroller = wrap.querySelector('.timeline__items');
        if (!scroller) {
          throw new Error(warningLabel + ' .timeline__items ' + errorPart + ' .timeline__wrap');
        } else {
          items = [].slice.call(scroller.children, 0);
        }
      }
    } catch (e) {
      console.warn(e.message);
      return false;
    }

    // Test setting input values
    Object.keys(defaultSettings).forEach(function (key) {
      settings[key] = defaultSettings[key].defaultValue;

      if (data[key]) {
        settings[key] = data[key];
      } else if (options && options[key]) {
        settings[key] = options[key];
      }

      if (defaultSettings[key].type === 'integer') {
        if (!settings[key] || !testValues(settings[key], key)) {
          settings[key] = defaultSettings[key].defaultValue;
        }
      } else if (defaultSettings[key].type === 'string') {
        if (defaultSettings[key].acceptedValues && defaultSettings[key].acceptedValues.indexOf(settings[key]) === -1) {
          console.warn(warningLabel + ' The value "' + settings[key] + '" entered for the setting "' + key + '" was not recognised.');
          settings[key] = defaultSettings[key].defaultValue;
        }
      }
    });

    // Further specific testing of input values
    var defaultTrigger = defaultSettings.verticalTrigger.defaultValue.match(/(\d*\.?\d*)(.*)/);
    var triggerArray = settings.verticalTrigger.match(/(\d*\.?\d*)(.*)/);

    var _triggerArray = _slicedToArray(triggerArray, 3);

    var triggerValue = _triggerArray[1];
    var triggerUnit = _triggerArray[2];

    var triggerValid = true;
    if (!triggerValue) {
      console.warn(warningLabel + ' No numercial value entered for the \'verticalTrigger\' setting.');
      triggerValid = false;
    }
    if (triggerUnit !== 'px' && triggerUnit !== '%') {
      console.warn(warningLabel + ' The setting \'verticalTrigger\' must be a percentage or pixel value.');
      triggerValid = false;
    }
    if (triggerUnit === '%' && (triggerValue > 100 || triggerValue < 0)) {
      console.warn(warningLabel + ' The \'verticalTrigger\' setting value must be between 0 and 100 if using a percentage value.');
      triggerValid = false;
    } else if (triggerUnit === 'px' && triggerValue < 0) {
      console.warn(warningLabel + ' The \'verticalTrigger\' setting value must be above 0 if using a pixel value.');
      triggerValid = false;
    }

    if (triggerValid === false) {
      var _defaultTrigger2 = _slicedToArray(defaultTrigger, 3);

      triggerValue = _defaultTrigger2[1];
      triggerUnit = _defaultTrigger2[2];
    }

    settings.verticalTrigger = {
      unit: triggerUnit,
      value: triggerValue
    };

    if (settings.moveItems > settings.visibleItems) {
      console.warn(warningLabel + ' The value of "moveItems" (' + settings.moveItems + ') is larger than the number of "visibleItems" (' + settings.visibleItems + '). The value of "visibleItems" has been used instead.');
      settings.moveItems = settings.visibleItems;
    }

    if (settings.startIndex > items.length - settings.visibleItems && items.length > settings.visibleItems) {
      console.warn(warningLabel + ' The \'startIndex\' setting must be between 0 and ' + (items.length - settings.visibleItems) + ' for this timeline. The value of ' + (items.length - settings.visibleItems) + ' has been used instead.');
      settings.startIndex = items.length - settings.visibleItems;
    } else if (items.length <= settings.visibleItems) {
      console.warn(warningLabel + ' The number of items in the timeline must exceed the number of visible items to use the \'startIndex\' option.');
      settings.startIndex = 0;
    } else if (settings.startIndex < 0) {
      console.warn(warningLabel + ' The \'startIndex\' setting must be between 0 and ' + (items.length - settings.visibleItems) + ' for this timeline. The value of 0 has been used instead.');
      settings.startIndex = 0;
    }

    timelines.push({
      timelineEl: timelineEl,
      wrap: wrap,
      scroller: scroller,
      items: items,
      settings: settings
    });
  }

  if (collection.length) {
    [].forEach.call(collection, createTimelines);
  }

  // Set height and widths of timeline elements and viewport
  function setHeightandWidths(tl) {
    // Set widths of items and viewport
    function setWidths() {
      tl.itemWidth = tl.wrap.offsetWidth / tl.settings.visibleItems;
      tl.items.forEach(function (item) {
        item.style.width = tl.itemWidth + 'px';
      });
      tl.scrollerWidth = tl.itemWidth * tl.items.length;
      tl.scroller.style.width = tl.scrollerWidth + 'px';
    }

    // Set height of items and viewport
    function setHeights() {
      var oddIndexTallest = 0;
      var evenIndexTallest = 0;
      tl.items.forEach(function (item, i) {
        item.style.height = 'auto';
        var height = item.offsetHeight;
        if (i % 2 === 0) {
          evenIndexTallest = height > evenIndexTallest ? height : evenIndexTallest;
        } else {
          oddIndexTallest = height > oddIndexTallest ? height : oddIndexTallest;
        }
      });

      var transformString = 'translateY(' + evenIndexTallest + 'px)';
      tl.items.forEach(function (item, i) {
        if (i % 2 === 0) {
          item.style.height = evenIndexTallest + 'px';
          if (tl.settings.horizontalStartPosition === 'bottom') {
            item.classList.add('timeline__item--bottom');
            addTransforms(item, transformString);
          } else {
            item.classList.add('timeline__item--top');
          }
        } else {
          item.style.height = oddIndexTallest + 'px';
          if (tl.settings.horizontalStartPosition !== 'bottom') {
            item.classList.add('timeline__item--bottom');
            addTransforms(item, transformString);
          } else {
            item.classList.add('timeline__item--top');
          }
        }
      });
      tl.scroller.style.height = evenIndexTallest + oddIndexTallest + 'px';
    }

    if (window.innerWidth > tl.settings.forceVerticalMode) {
      setWidths();
      setHeights();
    }
  }

  // Create and add arrow controls to horizontal timeline
  function addNavigation(tl) {
    if (tl.items.length > tl.settings.visibleItems) {
      var prevArrow = document.createElement('button');
      var nextArrow = document.createElement('button');
      var topPosition = tl.items[0].offsetHeight;
      prevArrow.className = 'timeline-nav-button timeline-nav-button--prev';
      nextArrow.className = 'timeline-nav-button timeline-nav-button--next';
      prevArrow.textContent = 'Previous';
      nextArrow.textContent = 'Next';
      prevArrow.style.top = topPosition + 'px';
      nextArrow.style.top = topPosition + 'px';
      if (currentIndex === 0) {
        prevArrow.disabled = true;
      } else if (currentIndex === tl.items.length - tl.settings.visibleItems) {
        nextArrow.disabled = true;
      }
      tl.timelineEl.appendChild(prevArrow);
      tl.timelineEl.appendChild(nextArrow);
    }
  }

  // Add the centre line to the horizontal timeline
  function addHorizontalDivider(tl) {
    var divider = tl.timelineEl.querySelector('.timeline-divider');
    if (divider) {
      tl.timelineEl.removeChild(divider);
    }
    var topPosition = tl.items[0].offsetHeight;
    var horizontalDivider = document.createElement('span');
    horizontalDivider.className = 'timeline-divider';
    horizontalDivider.style.top = topPosition + 'px';
    tl.timelineEl.appendChild(horizontalDivider);
  }

  // Calculate the new position of the horizontal timeline
  function timelinePosition(tl) {
    var position = tl.items[currentIndex].offsetLeft;
    var str = 'translate3d(-' + position + 'px, 0, 0)';
    addTransforms(tl.scroller, str);
  }

  // Make the horizontal timeline slide
  function slideTimeline(tl) {
    var navArrows = tl.timelineEl.querySelectorAll('.timeline-nav-button');
    var arrowPrev = tl.timelineEl.querySelector('.timeline-nav-button--prev');
    var arrowNext = tl.timelineEl.querySelector('.timeline-nav-button--next');
    var maxIndex = tl.items.length - tl.settings.visibleItems;
    var moveItems = parseInt(tl.settings.moveItems, 10);
    [].forEach.call(navArrows, function (arrow) {
      arrow.addEventListener('click', function (e) {
        e.preventDefault();
        currentIndex = this.classList.contains('timeline-nav-button--next') ? currentIndex += moveItems : currentIndex -= moveItems;
        if (currentIndex === 0 || currentIndex < 0) {
          currentIndex = 0;
          arrowPrev.disabled = true;
          arrowNext.disabled = false;
        } else if (currentIndex === maxIndex || currentIndex > maxIndex) {
          currentIndex = maxIndex;
          arrowPrev.disabled = false;
          arrowNext.disabled = true;
        } else {
          arrowPrev.disabled = false;
          arrowNext.disabled = false;
        }
        timelinePosition(tl);
      });
    });
  }

  // Set up horizontal timeline
  function setUpHorinzontalTimeline(tl) {
    if (tl.settings.rtlMode) {
      currentIndex = tl.items.length > tl.settings.visibleItems ? tl.items.length - tl.settings.visibleItems : 0;
    } else {
      currentIndex = tl.settings.startIndex;
    }
    tl.timelineEl.classList.add('timeline--horizontal');
    setHeightandWidths(tl);
    timelinePosition(tl);
    addNavigation(tl);
    addHorizontalDivider(tl);
    slideTimeline(tl);
  }

  // Set up vertical timeline
  function setUpVerticalTimeline(tl) {
    var lastVisibleIndex = 0;
    tl.items.forEach(function (item, i) {
      item.classList.remove('animated', 'fadeIn');
      if (!isElementInViewport(item, tl.settings.verticalTrigger) && i > 0) {
        item.classList.add('animated');
      } else {
        lastVisibleIndex = i;
      }
      var divider = tl.settings.verticalStartPosition === 'left' ? 1 : 0;
      if (i % 2 === divider && window.innerWidth > tl.settings.forceVerticalMode) {
        item.classList.add('timeline__item--right');
      } else {
        item.classList.add('timeline__item--left');
      }
    });
    for (var i = 0; i < lastVisibleIndex; i += 1) {
      tl.items[i].classList.remove('animated', 'fadeIn');
    }
    // Bring elements into view as the page is scrolled
    window.addEventListener('scroll', function () {
      tl.items.forEach(function (item) {
        if (isElementInViewport(item, tl.settings.verticalTrigger)) {
          item.classList.add('fadeIn');
        }
      });
    });
  }

  // Reset timelines
  function resetTimelines(tl) {
    tl.timelineEl.classList.remove('timeline--horizontal', 'timeline--mobile');
    tl.scroller.removeAttribute('style');
    tl.items.forEach(function (item) {
      item.removeAttribute('style');
      item.classList.remove('animated', 'fadeIn', 'timeline__item--left', 'timeline__item--right');
    });
    var navArrows = tl.timelineEl.querySelectorAll('.timeline-nav-button');
    [].forEach.call(navArrows, function (arrow) {
      arrow.parentNode.removeChild(arrow);
    });
  }

  // Set up the timelines
  function setUpTimelines() {
    timelines.forEach(function (tl) {
      tl.timelineEl.style.opacity = 0;
      if (!tl.timelineEl.classList.contains('timeline--loaded')) {
        wrapElements(tl.items);
      }
      resetTimelines(tl);
      if (window.innerWidth <= tl.settings.forceVerticalMode) {
        tl.timelineEl.classList.add('timeline--mobile');
      }
      if (tl.settings.mode === 'horizontal' && window.innerWidth > tl.settings.forceVerticalMode) {
        setUpHorinzontalTimeline(tl);
      } else {
        setUpVerticalTimeline(tl);
      }
      tl.timelineEl.classList.add('timeline--loaded');
      setTimeout(function () {
        tl.timelineEl.style.opacity = 1;
      }, 500);
    });
  }

  // Initialise the timelines on the page
  setUpTimelines();

  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      var newWinWidth = window.innerWidth;
      if (newWinWidth !== winWidth) {
        setUpTimelines();
        winWidth = newWinWidth;
      }
    }, 250);
  });
}

// Register as a jQuery plugin if the jQuery library is present
if (window.jQuery) {
  (function ($) {
    $.fn.timeline = function (opts) {
      timeline(this, opts);
      return this;
    };
  })(window.jQuery);
} 