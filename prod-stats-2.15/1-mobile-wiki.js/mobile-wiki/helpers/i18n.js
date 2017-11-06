define('mobile-wiki/helpers/i18n', ['exports'], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var Helper = Ember.Helper,
	    inject = Ember.inject;
	exports.default = Helper.extend({
		i18n: inject.service(),

		compute: function compute(params, options) {
			var i18nParams = {},
			    value = params.join('.');

			var namespace = 'main';

			/**
    * @param {string} key
    * @returns {void}
    */
			Object.keys(options).forEach(function (key) {
				if (key === 'ns') {
					namespace = options[key];
				} else if (options[key] !== undefined) {
					i18nParams[key] = options[key];
				}
			});

			return this.get('i18n').t(namespace + ':' + value, i18nParams);
		}
	});
});