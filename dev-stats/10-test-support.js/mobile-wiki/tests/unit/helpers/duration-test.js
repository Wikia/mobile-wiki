define('mobile-wiki/tests/unit/helpers/duration-test', ['ember-qunit', 'qunit', 'mobile-wiki/helpers/duration'], function (_emberQunit, _qunit, _duration) {
	'use strict';

	(0, _qunit.module)('Unit | Helper | duration', function () {
		(0, _emberQunit.test)('Duration helper is exported', function (assert) {
			assert.ok(_duration.default.compute);
		});

		(0, _emberQunit.test)('< 0 seconds', function (assert) {
			assert.equal(_duration.default.compute([-59]), '00:00');
		});

		(0, _emberQunit.test)('0 seconds', function (assert) {
			assert.equal(_duration.default.compute([0]), '00:00');
		});

		(0, _emberQunit.test)('< 60 seconds', function (assert) {
			assert.equal(_duration.default.compute([59]), '00:59');
		});

		(0, _emberQunit.test)('> 60 seconds and < 1 hour', function (assert) {
			assert.equal(_duration.default.compute([181]), '03:01');
		});

		(0, _emberQunit.test)('> 1 hour', function (assert) {
			assert.equal(_duration.default.compute([3661]), '01:01:01');
		});
	});
});