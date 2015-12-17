QUnit.module('main/helpers/duration-helper', function (hooks) {
	var durationHelper;

	hooks.beforeEach(function () {
		durationHelper = require('main/helpers/duration-helper').default.compute;
	});

	QUnit.test('Duration helper is exported', function () {
		ok(durationHelper);
	});

	QUnit.test('< 0 seconds', function () {
		equal(durationHelper([-59]), '00:00');
	});

	QUnit.test('0 seconds', function () {
		equal(durationHelper([0]), '00:00');
	});

	QUnit.test('< 60 seconds', function () {
		equal(durationHelper([59]), '00:59');
	});

	QUnit.test('> 60 seconds and < 1 hour', function () {
		equal(durationHelper([181]), '03:01');
	});

	QUnit.test('> 1 hour', function () {
		equal(durationHelper([3661]), '01:01:01');
	});
});
