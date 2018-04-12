import EmberRouter from '@ember/routing/router';
import {getOwner} from '@ember/application';
import RouterScroll from 'ember-router-scroll';
import config from './config/environment';
import getLanguageCodeFromRequest from './utils/language';

const Router = EmberRouter.extend(RouterScroll, {
	location: config.locationType,
	rootURL: config.rootURL,

	_buildDSL() {
		const dsl = this._super(...arguments);
		dsl.options.__owner = getOwner(this);

		return dsl;
	}
});

Router.map(function () {
	const fastboot = this.options.__owner.lookup('service:fastboot'),
		applyLangPath = (path) => {
			const langPath = getLanguageCodeFromRequest(fastboot.get('request'));

			if (langPath) {
				return `/${langPath}${path}`;
			}

			return path;
		};

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
