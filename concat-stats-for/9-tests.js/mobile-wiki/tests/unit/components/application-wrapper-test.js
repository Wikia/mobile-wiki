define('mobile-wiki/tests/unit/components/application-wrapper-test', ['ember-qunit'], function (_emberQunit) {
	'use strict';

	(0, _emberQunit.moduleForComponent)('application-wrapper', 'Unit | Component | application wrapper', {
		unit: true,
		needs: ['service:ads', 'service:current-user', 'service:fastboot', 'service:logger', 'service:wiki-variables']
	});

	(0, _emberQunit.test)('shouldHandleClick returns correct value', function (assert) {
		var _this = this;

		var testCases = [{
			target: '<li class="mw-content"></li>',
			expected: true
		}, {
			target: '<li></li>',
			expected: false
		}, {
			target: '<div class="PDS_Poll"></div>',
			expected: false
		}];

		testCases.forEach(function (testCase) {
			var component = _this.subject();

			assert.equal(component.shouldHandleClick(testCase.target), testCase.expected);
		});
	});
});