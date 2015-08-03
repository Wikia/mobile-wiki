/// <reference path="../../../../typings/jquery/jquery.d.ts" />
/// <reference path="../../../../typings/slick/slick.d.ts" />

'use strict';

$(function() : void {
	if ($('#js-parallax-window').length) {
		parallax();
	}

	$('.carousel').slick({
		dots: false,
		infinite: true,
		speed: 300,
		slidesToShow: 3,
		centerMode: true,
		variableWidth: false
	});
});

$(window).scroll(function(e) : void {
	if ($('#js-parallax-window').length) {
		parallax();
	}
});

function parallax() : void {
	if ($('#js-parallax-window').length > 0) {
		var plxBackground = $('#js-parallax-background'),
		    plxWindow = $('#js-parallax-window'),
		    plxWindowTopToPageTop : number = $(plxWindow).offset().top,
		    windowTopToPageTop = $(window).scrollTop(),
		    plxWindowTopToWindowTop = plxWindowTopToPageTop - windowTopToPageTop,
		    plxBackgroundTopToPageTop : number = $(plxBackground).offset().top,
		    windowInnerHeight : number = window.innerHeight,
		    plxBackgroundTopToWindowTop : number = plxBackgroundTopToPageTop - windowTopToPageTop,
		    plxBackgroundTopToWindowBottom : number = windowInnerHeight - plxBackgroundTopToWindowTop,
		    plxSpeed : number = 0.5;

		plxBackground.css('top', - (plxWindowTopToWindowTop * plxSpeed) + 'px');
	}
}

$('#search_wikia').click(function(event) : void {
	search();
	event.preventDefault();
});

$('#search_wikia_form').submit(function(event) : void {
	search();
	event.preventDefault();
});

function search() : void {
	var searchText : string = encodeURI($('#search_wikia_text').val()),
		searchUrl : string;

	if (searchText) {
		searchUrl = 'http://ja.wikia.com/Special:Search?search=';
		searchUrl += searchText;
		searchUrl += '&fulltext=Search&resultsLang=ja';

		window.location.href = searchUrl;
	}
}
