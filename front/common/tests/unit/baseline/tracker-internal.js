QUnit.module('M.tracker.Internal (loaded with baseline)', function (hooks) {
	var result;

	hooks.beforeEach(function () {
		M.provide('wiki', {
			language: {
				content: 'en'
			}
		});
	});

	QUnit.test('createRequestURL - empty params', function (assert) {
		result = M.tracker.Internal._createRequestURL('special/trackingevent', {});

		assert.equal(result,
			'https://beacon.wikia-services.com/__track/special/trackingevent?',
			'Request url is equal to expected'
		);
	});

	QUnit.test('createRequestURL - params are object without empty values', function (assert) {
		result = M.tracker.Internal._createRequestURL('special/trackingevent', {
			fizz: 'buzz',
			fizz2: 'buzz2'
		});

		assert.equal(result,
			'https://beacon.wikia-services.com/__track/special/trackingevent?fizz=buzz&fizz2=buzz2',
			'Request url is equal to expected'
		);
	});

	QUnit.test('createRequestURL - params are encoded', function (assert) {
		result = M.tracker.Internal._createRequestURL('special/trackingevent', {
			'fizz&&&': 'buzz???'
		});

		assert.equal(result,
			'https://beacon.wikia-services.com/__track/special/trackingevent?fizz%26%26%26=buzz%3F%3F%3F',
			'Request url is equal to expected'
		);
	});

	QUnit.test('createRequestURL - params are object with empty values', function (assert) {
		result = M.tracker.Internal._createRequestURL('special/trackingevent', {
			fizz: 'buzz',
			fizz2: null
		});

		assert.equal(result,
			'https://beacon.wikia-services.com/__track/special/trackingevent?fizz=buzz',
			'Request url is equal to expected'
		);
	});
});
