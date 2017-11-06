define('mobile-wiki/components/fastboot-only/head-bottom', ['exports'], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var Component = Ember.Component;
	var equal = Ember.computed.equal;
	exports.default = Component.extend({
		tagName: '',
		layoutName: 'components/fastboot-only/head-bottom',
		wikiVariables: null,
		isRtl: equal('wikiVariables.language.contentDir', 'rtl')
	});
});