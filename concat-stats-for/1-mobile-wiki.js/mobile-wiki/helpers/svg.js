define('mobile-wiki/helpers/svg', ['exports'], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = Ember.Helper.helper(function (params, options) {
		var optionalParams = ['class', 'role', 'viewBox', 'width', 'height'],
		    name = params[0];

		var ret = '<svg';

		optionalParams.forEach(function (param) {
			if (param in options) {
				ret += ' ' + param + '="' + options[param] + '"';
			}
		});
		ret += '><use xlink:href="#' + name + '"></use></svg>';

		return new Ember.String.htmlSafe(ret);
	});
});