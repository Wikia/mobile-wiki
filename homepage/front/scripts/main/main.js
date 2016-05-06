import * as globals from './globals';
import {loadSearch} from './search';

/**
 * Perform search
 *
 * @param {boolean} [isTopNav=true]
 * @returns {void}
 */
function search(isTopNav = true) {
	let searchText = encodeURI($('#searchWikiaText').val()),
		searchUrl;

	if (isTopNav) {
		searchText = encodeURI($('#searchWikiaText').val());

		if (!searchText) {
			// search button for mobile is different element
			searchText = encodeURI($('#searchWikiaTextMobile').val());
		}
	} else {
		searchText = encodeURI($('#wiwSearchWikiaTextDesktop').val());

		if (!searchText) {
			// search button for mobile is different element
			searchText = encodeURI($('#wiwSarchWikiaTextMobile').val());
		}
	}

	if (searchText) {
		if (window.optimizely.variationMap[globals.getOptimizelyId()] === 1) {
			// Use Google search
			if (window.location.pathname === '/') {
				searchUrl = `search?q=${searchText}`;
			} else {
				searchUrl = `/search?q=${searchText}`;
			}
		} else {
			// Use Oasis search
			searchUrl = `http://ja.wikia.com/Special:Search?search=${searchText}&fulltext=Search&resultsLang=ja`;
		}

		window.location.href = searchUrl;
	}
}

/**
 * Hides the loading indicator
 * @returns {void}
 */
function hideLoadingIndicator() {
	$('#loading').addClass('loading-done');
	$('#loading-mobile').addClass('loading-done');
}

$(() => {
	$('.hero-image-desktop').load(() => {
		hideLoadingIndicator();
	});

	$('.hero-carousel').slick({
		arrows: true,
		dots: true,
		autoplay: true,
		autoplaySpeed: 3000,
		slidesToShow: 1,
		lazyLoad: 'ondemand',
		responsive: [
			{
				breakpoint: 1000,
				settings: {
					dots: false
				}
			}
		]
	});

	$('.hero-carousel-mobile').slick({
		arrows: true,
		dots: true,
		autoplay: true,
		autoplaySpeed: 3000,
		slidesToShow: 1,
		lazyLoad: 'ondemand',
	});

	globals.loadGlobalData().then((data) => {
		if (window.location.href.indexOf('search') !== -1) {
			loadSearch(data.mobileBreakpoint);
		}
	});
});

$('#beginnersGuide').click((event) => {
	window.location.href = '/beginners';
	event.preventDefault();
});

$('.search-wikia-form').submit((event) => {
	search();
	event.preventDefault();
});

$('.search-wikia').click((event) => {
	search();
	event.preventDefault();
});

$('.jw-community-link').click(() => {
	window.location.href = globals.getJaCommunityUrl();
});

$('.jw-university-link').click(() => {
	window.location.href = globals.getJaUniversityUrl();
});

$('.wiw-search-wikia-form').submit((event) => {
	search(false);
	event.preventDefault();
});

$('.wiw-search-wikia-button').click((event) => {
	search(false);
	event.preventDefault();
});

$('.wiw-start-wikia').click(() => {
	window.location.href = globals.getStartWikiaUrl();
});

$('#loginIcon').click((event) => {
	if ($(document).width() < globals.getMobileBreakpoint()) {
		$('#userInfoToggle').toggle();
	} else {
		window.location.href = globals.getLoginUrl();
	}

	event.preventDefault();
});
