import {loadGlobalData, getLoginUrl} from './globals';

const parallaxWindow = $('#js-parallax-window');

/**
 * @returns {void}
 */
function parallax() {
	if (parallaxWindow.length > 0) {
		const plxBackground = $('#js-parallax-background'),
			plxWindow = $('#js-parallax-window'),
			plxWindowTopToPageTop = $(plxWindow).offset().top,
			windowTopToPageTop = $(window).scrollTop(),
			plxWindowTopToWindowTop = plxWindowTopToPageTop - windowTopToPageTop,
			plxSpeed = 0.5;

		plxBackground.css('top', `${-(plxWindowTopToWindowTop * plxSpeed)}px`);
	}
}

/**
 * @returns {void}
 */
function search() {
	let searchText = encodeURI($('#searchWikiaText').val());

	if (!searchText) {
		// search button for mobile is different element
		searchText = encodeURI($('#searchWikiaTextMobile').val());
	}

	if (searchText) {
		window.location.href = `http://ja.wikia.com/Special:Search?search=${searchText}&fulltext=Search&resultsLang=ja`;
	}
}

$(() => {
	const headings = $('.grid-heading');

	if (parallaxWindow.length) {
		parallax();

		$(window).scroll(() => {
			parallax();
		});
	}

	$('.carousel').slick({
		arrows: true,
		dots: false,
		infinite: false,
		speed: 300,
		slidesToShow: 2,
		centerMode: false,
		variableWidth: true
	});

	// Dynamically adjust text size to show community title without text break.
	// bigText adjusts the size programatically and strips off css padding, so it is
	// necessary to add it in explicitly afterwards
	headings.bigText({maximumFontSize: 20, verticalAlign: 'top'});
	headings.css({padding: '.1rem'});

	loadGlobalData();
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

$('#loginIcon').click((event) => {
	if ($(document).width() < 710) {
		$('#userInfoToggle').toggle();
	} else {
		window.location.href = getLoginUrl();
	}

	event.preventDefault();
});

$('#whatIsWikia').click((event) => {
	window.location.href = '/beginners';
	event.preventDefault();
});
