QUnit.module('M.tracker.Internal (loaded with baseline)', function (hooks) {
	var result;

	hooks.beforeEach(function () {
		M.prop('apiBase', '/api/mercury', true);
		M.provide('wiki', {
			language: {
				content: 'en'
			}
		});

		M.tracker.Internal.initialize();
	});

	QUnit.test('createRequestURL - empty params', function (assert) {
		result = M.tracker.Internal._createRequestURL('foo', {});

		assert.equal(result,
			'https://beacon.wikia-services.com/__track/special/trackingevent?',
			'Request url is equal to expected'
		);
	});

	QUnit.test('createRequestURL - params are object without empty values', function (assert) {
		result = M.tracker.Internal._createRequestURL('foo', {
			fizz: 'buzz',
			fizz2: 'buzz2'
		});

		assert.equal(result,
			'https://beacon.wikia-services.com/__track/special/trackingevent?fizz=buzz&fizz2=buzz2',
			'Request url is equal to expected'
		);
	});

	QUnit.test('createRequestURL - params are encoded', function (assert) {
		result = M.tracker.Internal._createRequestURL('foo', {
			'fizz&&&': 'buzz???'
		});

		assert.equal(result,
			'https://beacon.wikia-services.com/__track/special/trackingevent?fizz%26%26%26=buzz%3F%3F%3F',
			'Request url is equal to expected'
		);
	});

	QUnit.test('createRequestURL - params are object with empty values', function (assert) {
		result = M.tracker.Internal._createRequestURL('foo', {
			fizz: 'buzz',
			fizz2: null
		});

		assert.equal(result,
			'https://beacon.wikia-services.com/__track/special/trackingevent?fizz=buzz',
			'Request url is equal to expected'
		);
	});
});
