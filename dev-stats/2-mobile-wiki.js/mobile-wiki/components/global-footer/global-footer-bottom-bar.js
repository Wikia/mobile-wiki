define('mobile-wiki/components/global-footer/global-footer-bottom-bar', ['exports', 'mobile-wiki/config/environment'], function (exports, _environment) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var $ = Ember.$,
	    Component = Ember.Component,
	    inject = Ember.inject;
	exports.default = Component.extend({
		tagName: '',
		wikiVariables: inject.service(),

		actions: {
			fullSiteClicked: function fullSiteClicked() {
				this.get('track')('full-site-link');
				$.cookie('useskin', this.getWithDefault('wikiVariables.defaultSkin', 'oasis'), {
					domain: _environment.default.cookieDomain,
					path: '/'
				});
			}
		}
	});
});