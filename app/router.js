import Ember from 'ember';
import RouterScroll from 'ember-router-scroll';
import config from './config/environment';

const Router = Ember.Router.extend(RouterScroll, {
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
});

export default Router;
