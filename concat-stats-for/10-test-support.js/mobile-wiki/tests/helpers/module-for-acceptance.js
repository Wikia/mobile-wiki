define('mobile-wiki/tests/helpers/module-for-acceptance', ['exports', 'qunit', 'mobile-wiki/tests/helpers/start-app', 'mobile-wiki/tests/helpers/destroy-app'], function (exports, _qunit, _startApp, _destroyApp) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	exports.default = function (name) {
		var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

		(0, _qunit.module)(name, {
			beforeEach: function beforeEach() {
				this.application = (0, _startApp.default)();

				if (options.beforeEach) {
					return options.beforeEach.apply(this, arguments);
				}
			},
			afterEach: function afterEach() {
				var _this = this;

				var afterEach = options.afterEach && options.afterEach.apply(this, arguments);
				return resolve(afterEach).then(function () {
					return (0, _destroyApp.default)(_this.application);
				});
			}
		});
	};

	var resolve = Ember.RSVP.resolve;
});