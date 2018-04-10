import EmberRouter from '@ember/routing/router';
import RouterScroll from 'ember-router-scroll';
import config from './config/environment';
import getLanguageCodeFromRequest from './utils/language';

const Router = EmberRouter.extend(RouterScroll, {
	location: config.locationType,
	rootURL: config.rootURL
});

function applyLangPath(path) {
	let langPath = '/:lang_path';
	if (typeof FastBoot === 'undefined') {
		langPath = `/${getLanguageCodeFromRequest()}`;
	}
	return `${langPath}${path}`;
}

Router.map(function () {
	this.route('article-preview', {
		path: applyLangPath('/article-preview')
	});

	this.route('search', {
		path: applyLangPath('/search')
	});

	this.route('main-page-redirect', {
		path: applyLangPath('/wiki/')
	});

	this.route('wiki-page', {
		path: applyLangPath('/wiki/*title')
	});

	this.route('article-edit', {
		path: applyLangPath('/wiki/edit/:title/:section_index')
	});
});

export default Router;
