define('mobile-wiki/mixins/application-wrapper-class-names', ['exports'], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var Mixin = Ember.Mixin;
	var on = Ember.on;
	exports.default = Mixin.create({
		addBodyClassOnActivate: on('activate', function () {
			var controller = this.controllerFor('application');
			var classNames = this.get('applicationWrapperClassNames') || [];
			var applicationWrapperClassNames = controller.get('applicationWrapperClassNames');

			controller.set('applicationWrapperClassNames', applicationWrapperClassNames.concat(classNames));
		}),

		removeBodyClassOnDeactivate: on('deactivate', function () {
			var controller = this.controllerFor('application');
			var classNames = this.get('applicationWrapperClassNames') || [];
			var applicationWrapperClassNames = controller.get('applicationWrapperClassNames');

			controller.set('applicationWrapperClassNames', applicationWrapperClassNames.filter(function (item) {
				return classNames.indexOf(item) === -1;
			}));
		})
	});
});