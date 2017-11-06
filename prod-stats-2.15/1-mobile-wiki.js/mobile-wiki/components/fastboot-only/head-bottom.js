define('mobile-wiki/components/fastboot-only/head-bottom', ['exports'], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var Component = Ember.Component,
	    computed = Ember.computed;
	exports.default = Component.extend({
		tagName: '',
		layoutName: 'components/fastboot-only/head-bottom',
		wikiVariables: null,
		isRtl: computed.equal('wikiVariables.language.contentDir', 'rtl')
	});
});