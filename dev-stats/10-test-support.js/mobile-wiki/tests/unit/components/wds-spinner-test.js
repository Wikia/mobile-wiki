define('mobile-wiki/tests/unit/components/wds-spinner-test', ['ember-qunit'], function (_emberQunit) {
	'use strict';

	(0, _emberQunit.moduleForComponent)('wds-spinner', 'Unit | Component | loading spinner', {
		unit: true
	});

	(0, _emberQunit.test)('should be hidden by default', function (assert) {
		var _this = this;

		Ember.run(function () {
			var componentMock = _this.subject();

			assert.equal(componentMock.get('isVisible'), false);
		});
	});

	(0, _emberQunit.test)('should be visible if loading param is truthy', function (assert) {
		var _this2 = this;

		Ember.run(function () {
			var componentMock = _this2.subject();

			componentMock.set('active', true);
			assert.equal(componentMock.get('isVisible'), true);
		});
	});

	(0, _emberQunit.test)('should be hidden if loading param is falsy', function (assert) {
		var _this3 = this;

		Ember.run(function () {
			var componentMock = _this3.subject();

			componentMock.set('active', false);
			assert.equal(componentMock.get('isVisible'), false);
		});
	});
});