define('mobile-wiki/tests/unit/helpers/truncate-test', ['ember-qunit', 'qunit', 'mobile-wiki/helpers/truncate'], function (_emberQunit, _qunit, _truncate) {
	'use strict';

	(0, _qunit.module)('Unit | Helper | truncate', function () {

		(0, _emberQunit.test)('Truncate helper is exported', function (assert) {
			assert.ok(_truncate.default.compute);
		});

		(0, _emberQunit.test)('short text', function (assert) {
			assert.equal(_truncate.default.compute(['short text']), 'short text');
		});

		(0, _emberQunit.test)('long text', function (assert) {
			assert.equal(_truncate.default.compute(['long text, please truncate', 20]), 'long text, please\u2026');
		});

		(0, _emberQunit.test)('number instead of text', function (assert) {
			assert.equal(_truncate.default.compute([20]), null);
		});
	});
});