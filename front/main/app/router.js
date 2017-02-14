import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
	location: config.locationType
});

Router.map(function () {
	this.route('article-preview');

	this.route('search');

	this.route('wiki-page', {
		path: '/wiki/*title'
	});

	this.route('articleEdit', {
		path: '/wiki/edit/:title/:sectionIndex'
	});

	this.route('articleAddPhoto', {
		path: '/wiki/addPhoto/:title'
	});

	// Route to catch all badly formed URLs
	this.route('notFound', {
		path: '/*url'
	});
});

export default Router;
