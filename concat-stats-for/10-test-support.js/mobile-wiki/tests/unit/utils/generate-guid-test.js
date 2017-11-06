define('mobile-wiki/tests/unit/utils/generate-guid-test', ['qunit', 'ember-qunit', 'sinon', 'mobile-wiki/utils/generate-guid'], function (_qunit, _emberQunit, _sinon, _generateGuid) {
	'use strict';

	(0, _qunit.module)('Unit | Utility | generate-guid', function (hooks) {
		hooks.beforeEach(function () {
			_sinon.default.stub(Date, 'now').returns('1234');
		});

		hooks.afterEach(function () {
			Date.now.restore();
		});

		(0, _emberQunit.test)('generateGuid helper is exported', function (assert) {
			assert.ok(_generateGuid.default);
		});

		(0, _emberQunit.test)('creates unique string with and without params', function (assert) {
			var testCases = [{
				prefix: 'label',
				expected: 'label1234'
			}, {
				expected: '1234'
			}];

			testCases.forEach(function (testCase) {
				assert.strictEqual((0, _generateGuid.default)(testCase.prefix), testCase.expected);
			});
		});
	});
});