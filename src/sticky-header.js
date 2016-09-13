/* global window */
/**
* @module {Object} sticky-header
* @parent sticky-header
*/

import $ from 'jquery';
import can from 'can';

const log = function () {
	let logger;
	// Check if debug exists on window
	if (window && window.debug) {
		logger = console.log;

		// Use a custom debugging tool
		if (typeof window.debug === 'function') {
			logger = window.debug;
		}
		logger.apply(logger, arguments);
	}
};

// Active sticky headers in DOM
export const stickyHeaders = [];

// Helper: Toggles class on a target element
export const handler = function(item, makeSticky) {
	// Don't check class list unless we need to make a change
	if (makeSticky && item.isSticky === false){
		log('Applying class');
		item.$el.addClass('sticky');
		item.isSticky = true;
	}
	if (!makeSticky && item.isSticky === true){
		log('removing class');
		item.$el.removeClass('sticky');
		item.isSticky = false;
	}
};

export const scrollHandler = function () {
	const scrollPos = $(this).scrollTop();
	log('window scroll event triggered');

	// Check if any elements registered as sticky headers
	if (stickyHeaders.length > 0) {
		log('there are elements registered');

		// Update all sticky headers
		stickyHeaders.forEach(item => {
			const actualTop = item.$parent.offset().top;
			log('checking positions for element...');
			log('Element:', actualTop, 'scroll:', scrollPos);
			let makeSticky = false;
			if (actualTop <= scrollPos) {
				makeSticky = true;
			}
			log('make sticky', makeSticky);
			handler(item, makeSticky);
		});
	} else {
		log('no elements registered');
	}
};

export const attrHandler = function (el, opts) {
	const $el = $(el);
	const item = {
		isSticky: false,
		$el: $el
	};

	log('Sticky header initing for element');

	// Register element with sticky headers
	stickyHeaders.push(item);

	// TODO: This feels brittle, needs work
	$el.wrap('<div class="sticky-header-wrap"></div>');
	$el.addClass('sticky-header');
	item.$parent = $el.parent();

	// Remove scroll event when element removed
	log('Adding remove listener');
	$el.bind('removed', function(){
		log('Element removed, deregistering element');

		// find element in list
		const index = stickyHeaders.findIndex(item => {
			return item.$el === $el;
		});
		// Deregister element; remove element from array
		if (typeof index !== 'undefined') {
		// stickyHeaders[index].$parent.remove();
			stickyHeaders.splice(index, 1);
		} else {
			log('could not find element, cannot deregister')
		}
	});
};

can.view.attr('sticky-header', attrHandler);

// Create event listener, handles all scroll events for sticky headers
// TODO: Throttle this callback
$(window).scroll(scrollHandler);
