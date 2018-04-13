import EmberRouter from '@ember/routing/router';
import {getOwner} from '@ember/application';
import {inject as service} from '@ember/service';
import {computed} from '@ember/object';
import RouterScroll from 'ember-router-scroll';
import config from './config/environment';

const Router = EmberRouter.extend(RouterScroll, {
	buildUrl: service(),

	location: config.locationType,
	rootURL: computed(function () {
		const langPath = this.get('buildUrl.langPath');
		if (langPath) {
			return `${langPath}/`;
		}
		return '/';
	})
});

Router.map(function () {
	this.route('article-preview');

	this.route('search');

	this.route('main-page-redirect', {
		path: '/wiki/'
	});

	this.route('wiki-page', {
		path: '/wiki/*title'
	});

	this.route('article-edit', {
		path: '/wiki/edit/:title/:section_index'
	});
});

export default Router;
