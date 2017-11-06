define('mobile-wiki/helpers/svg', ['exports'], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var htmlSafe = Ember.String.htmlSafe;
	var helper = Ember.Helper.helper;
	exports.default = helper(function (params, options) {
		var optionalParams = ['class', 'role', 'viewBox', 'width', 'height'],
		    name = params[0];

		var ret = '<svg';

		optionalParams.forEach(function (param) {
			if (param in options) {
				ret += ' ' + param + '="' + options[param] + '"';
			}
		});
		ret += '><use xlink:href="#' + name + '"></use></svg>';

		return htmlSafe(ret);
	});
});