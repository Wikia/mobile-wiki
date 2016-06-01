import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
	location: config.locationType
});

Router.map(function () {
	this.route('article-preview');

	// we use here wilcard instead of a dynamic segment to be able to
	// handle in builder also sub-templates (with /)
	this.route('infobox-builder', {
		path: '/infobox-builder/*templateName'
	});

	this.route('infobox-builder');

	this.route('mainPageSection', {
		path: '/main/section/:sectionName'
	});

	this.route('mainPageCategory', {
		path: '/main/category/:categoryName'
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

		this.route('communityData', {
			path: '/community'
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

	this.route('articleDiff', {
		path: '/diff/:oldId/:newId'
	});

	this.route('wiki-page', {
		path: '/wiki/*title'
	});

	this.route('articleEdit', {
		path: '/wiki/edit/:title/:sectionIndex'
	});

	this.route('articleAddPhoto', {
		path: '/wiki/addPhoto/:title'
	});

	this.route('discussion', {
		path: '/d'
	}, function () {
		this.route('forum', {
			path: '/f'
		});

		this.route('reported-posts', {
			path: '/reported'
		});

		this.route('post', {
			path: '/p/:postId'
		});

		this.route('reply', {
			path: '/p/:postId/r/:replyId'
		});

		this.route('user', {
			path: '/u/:userId'
		});
	});

	this.route('image-review');

	this.route('recent-wiki-activity');

	// Route to catch all badly formed URLs
	this.route('notFound', {
		path: '/*url'
	});
});

export default Router;
