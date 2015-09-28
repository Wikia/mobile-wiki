/// <reference path="../app.ts" />
/// <reference path="../../baseline/mercury.d.ts" />
'use strict';

App.SearchResultsController = Em.Controller.extend({
	queryParams: ['q'],
	q: null,

	init: function() : void {
		// Google custom search injection
		// https://developers.google.com/custom-search/docs/tutorial/implementingsearchbox
		var searchKey : string = '006230450596576500385:kcgbfm7zpa8',
			googleCustomSearch : HTMLScriptElement = document.createElement('script'),
			s : HTMLScriptElement;

		googleCustomSearch.type = 'text/javascript';
		googleCustomSearch.async = true;
		googleCustomSearch.src = (document.location.protocol === 'https:' ? 'https:' : 'http:') +
			'//www.google.com/cse/cse.js?cx=' + searchKey;

		s = document.getElementsByTagName('script')[0];
		s.parentNode.insertBefore(googleCustomSearch, s);
	}
});
