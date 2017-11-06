define('mobile-wiki/controllers/application-error', ['exports'], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var Controller = Ember.Controller;
	var computed = Ember.computed;
	exports.default = Controller.extend({
		additionalData: computed(function () {
			var additionalData = this.get('model.additionalData');

			return additionalData ? JSON.stringify(additionalData, null, 1) : null;
		}),

		stackTrace: computed(function () {
			var stackTrace = (this.get('model.normalizedStack') || '').replace(new RegExp('\\n', 'g'), '<br />');

			return stackTrace ? stackTrace : 'No stack trace available';
		})
	});
});