define('mobile-wiki/components/fastboot-only/body-bottom', ['exports', 'mobile-wiki/config/environment'], function (exports, _environment) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var Component = Ember.Component;
	var bool = Ember.computed.bool;
	exports.default = Component.extend({
		tagName: '',
		layoutName: 'components/fastboot-only/body-bottom',
		noExternals: bool('queryParams.noexternals'),
		inContextTranslationsEnabled: _environment.default.inContextTranslationsEnabled
	});
});