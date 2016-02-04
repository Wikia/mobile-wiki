import * as globals from './globals';
import {loadSearch} from './search';

/**
 * Perform search
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
}

/**
 * Calculates and sets compensation for the right slider arrow to account for variable spacing between slides.
 * See INT-319 and INT-329. 250 is the fixed pixel width of each slide
 * @returns {void}
 */
function calculateCarouselCompensation() {
	const delta = $('#carousel-1 .slick-slide').width() - 250,
		deltaMedium = $('#carousel-1-medium .slick-slide').width() - 250;

	for (let i = 1; i <= 5; i++) {
		$(`#carousel-${i} .slick-prev`).addClass('slick-prev-category');
		$(`#carousel-${i}-medium .slick-prev`).addClass('slick-prev-category');

		if (delta > 0) {
			$(`#carousel-${i} .slick-next`).css('right', delta + 10);
		} else {
			$(`#carousel-${i} .slick-next`).css('right', '');
		}

		if (deltaMedium > 0) {
			$(`#carousel-${i}-medium .slick-next`).css('right', deltaMedium + 10);
		} else {
			$(`#carousel-${i}-medium .slick-next`).css('right', 20);
		}
	}

	if (delta > 0) {
		// Compensation for slide not being fully centered due to responsive slider spacing
		$('.featured').css('padding-left', 54 + delta);
	} else {
		$('.featured').css('padding-left', '');
	}

	if (deltaMedium > 0) {
		// Compensation for slide not being fully centered due to responsive slider spacing
		$('.featured-mobile-medium').css('padding-left', 54 + deltaMedium);
	} else {
		$('.featured-mobile-medium').css('padding-left', '');
	}
}

$(() => {
	// Hide loading indicator after load complete
	$(window).load(() => {
		hideLoadingIndicator();
	});

	// Or after 6 seconds
	setTimeout(() => {
		hideLoadingIndicator();
	}, 6000);

	$('.hero-carousel').slick({
		arrows: true,
		dots: true,
		autoplay: true,
		autoplaySpeed: 3000,
		slidesToShow: 1,
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
	});

	$('.featured-carousel').slick({
		arrows: true,
		dots: false,
		slidesToShow: 4,
		slidesToScroll: 4,
	});

	$('.featured-carousel-medium').slick({
		arrows: true,
		dots: false,
		slidesToShow: 3,
		slidesToScroll: 3,
	});

	$(window).resize(() => {
		calculateCarouselCompensation();
	});

	calculateCarouselCompensation();

	globals.loadGlobalData().then((data) => {
		loadSearch(data.mobileBreakpoint);
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
