import EmberRouter from '@ember/routing/router';
import RouterScroll from 'ember-router-scroll';
import config from './config/environment';

const Router = EmberRouter.extend(RouterScroll, {
	location: config.locationType,
	rootURL: config.rootURL
});

Router.map(function () {
	// this.route('article-preview');

	// this.route('search');

	// this.route('main-page-redirect', {
	// 	path: '/wiki/'
	// });

	this.route('wiki-page', {
		path: '/wiki/*title'
	});

	// this.route('article-edit', {
	// 	path: '/wiki/edit/:title/:section_index'
	// });
});

export default Router;
