import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
	/**
	 * Sets location API depending on user agent with special case for Catchpoint tests
	 * @see http://emberjs.com/guides/routing/specifying-the-location-api/
	 */
	location: Ember.computed(() => {
		const ua = Ember.get(window, 'navigator.userAgent');

		return (ua && ua.match(/Catchpoint/)) ? 'none' : config.locationType;
	})
});

Router.map(function () {
	const articlePath = '/wiki/';

	this.route('mainPage', {
		path: articlePath + Mercury.wiki.mainPageTitle
	});

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
		path: `${articlePath}*title`
	});

	this.route('articleEdit', {
		path: `${articlePath}edit/:title/:sectionIndex`
	});

	this.route('articleAddPhoto', {
		path: `${articlePath}addPhoto/:title`
	});

	this.route('searchResults', {
		path: '/search'
	});

	this.route('discussion', {
		path: '/d'
	}, function () {
		this.route('forum', {
			path: '/f/:forumId'
		});

		this.route('forum', {
			path: '/f/:forumId/:sortBy'
		});

		this.route('post', {
			path: '/p/:postId'
		});
	});

	// Route to catch all badly formed URLs
	this.route('notFound', {
		path: '/*url'
	});
});

export default Router;
