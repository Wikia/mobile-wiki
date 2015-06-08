/// <reference path="./app.ts" />
'use strict';

App.Router.map(function () {
	/*
	This can be either '/*title' or '/wiki/*title' and is based on configuration
	That is coming from MW
	but if anything happens lets default to /wiki/*title

	ensure that it has trailing / also
	 */
	var articlePath = Em.getWithDefault(Mercury, 'wiki.articlePath', '/wiki/').replace(/\/?$/, '/');

	this.route('mainPage', {
		path: '/'
	});

	this.route('article', {
		path: articlePath + '*title'
	});

	this.route('edit', { // Symbolic link to EditController
		path: articlePath + 'edit/:title/:sectionIndex'
	});

	this.route('test', {
		path:'test'
	});

	// We don't want to duplicate the previous route
	if (articlePath !== '/') {
		/*
		 Route to catch all badly formed URLs, i.e., anything that doesn't match '/', '/wiki' or '/wiki/title',
		 which are the three cases already handled by existing routes.
		 */
		this.route('notFound', {
			path: '/*url'
		});
	}
});

App.Router.reopen({
	/**
	 * Sets location API depending on user agent with special case for Catchpoint tests
	 * @see http://emberjs.com/guides/routing/specifying-the-location-api/
	 */
	location: Em.computed(function (): string {
		var ua = Em.get(window, 'navigator.userAgent');
		return (ua && ua.match(/Catchpoint/)) ? 'none' : 'history';
	})
});
