define('mobile-wiki/helpers/wrap-me', ['exports'], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var Handlebars = Ember.Handlebars,
	    Helper = Ember.Helper,
	    htmlSafe = Ember.String.htmlSafe;
	exports.default = Helper.helper(function (params, options) {
		var content = Handlebars.Utils.escapeExpression(params[0] || '');
		var tagName = 'span',
		    className = '',
		    otherOptions = {
			href: '',
			target: ''
		},
		    otherOptionsCombined = void 0;

		if (options.tagName) {
			tagName = options.tagName;
		}

		if (options.className) {
			className = ' class="' + options.className + '"';
		}

		otherOptionsCombined = Object.keys(otherOptions).map(function (key) {
			return options[key] ? ' ' + key + '="' + options[key] + '"' : '';
		}).join('');

		return new htmlSafe('<' + tagName + className + otherOptionsCombined + '>' + content + '</' + tagName + '>').toHTML();
	});
});