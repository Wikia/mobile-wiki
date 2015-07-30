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
	}, function () {
		this.route('section', {
			path: '/main/section/:sectionName'
		});

		this.route('category', {
			path: '/main/category/:categoryName'
		});
	});

	this.route('curatedContentEditor', {
		path: '/main/edit'
	}, function () {
		this.route('section', {
			path: '/section/:section'
		}, function () {
			this.route('edit');

			this.route('addItem', {
				path: '/add'
			});

			this.route('editItem', {
				path: '/:item/edit'
			});
		});

		this.route('sectionAdd', {
			path: '/curated/add'
		});

		this.route('blockAddItem', {
			path: '/:block/add'
		});

		this.route('blockEditItem', {
			path: '/:block/:item/edit'
		});

		// When user tries to load invalid path under /main/edit/* we redirect to /main/edit
		this.route('invalid', {
			path: '/*url'
		});
	});

	this.route('article', {
		path: articlePath + '*title'
	});

	this.route('edit', { // Symbolic link to EditController
		path: articlePath + 'edit/:title/:sectionIndex'
	});

	this.route('addPhoto', { // Symbolic link to AddPhotoController
		path: articlePath + 'addPhoto/:title'
	});

	this.resource('discussion', {path: 'discuss'}, function () {
		this.resource('discussion.forum', {path: ':forumId'}, function () {
			this.route('post', {path: ':postId'});
		});
	});

	// We don't want to duplicate the previous route
	if (articlePath !== '/') {
		// Route to catch all badly formed URLs
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
