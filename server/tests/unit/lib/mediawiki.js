QUnit.module('lib/mediawiki');

QUnit.test('createURL', function (assert) {
	global.settings.default.environment = 'dev';
	global.settings.default.devboxDomain = 'test';
	global.settings.default.mediawikiDomain = undefined;

	assert.equal(global.createUrl('foo.test.wikia-dev.pl', 'api/test', {}),
		'http://foo.test.wikia-dev.pl/api/test', 'zero query params');
	assert.equal(global.createUrl('foo.test.wikia-dev.pl', 'api/test', {
		title: 'bar'
	}), 'http://foo.test.wikia-dev.pl/api/test?title=bar', 'one query param');
	assert.equal(global.createUrl('foo.test.wikia-dev.pl', 'api/test', {
		title: 'bar',
		param: 'gibberish'
	}), 'http://foo.test.wikia-dev.pl/api/test?title=bar&param=gibberish', 'two query params');
	assert.equal(global.createUrl('foo.test.wikia-dev.pl', 'api/test'),
		'http://foo.test.wikia-dev.pl/api/test', 'missing query params');

	global.settings.default.mediawikiDomain = 'mediawiki.service.consul';
	assert.equal(global.createUrl('foo.test.wikia-dev.pl', 'api/test', {}),
		'http://mediawiki.service.consul/api/test', 'consul url rewrite');
});

QUnit.test('Constructors', function (assert) {
	var testCases = [
		{
			name: 'PageRequest',
			data: {
				title: 'title',
				name: 'name'
			}
		},
		{
			name: 'WikiRequest',
			data: {
				name: 'name'
			}
		}
	];

	testCases.forEach(function (testCase) {
		assert.equal(typeof global[testCase.name], 'function', testCase.name + ' be a function');
		assert.equal(typeof new global[testCase.name](testCase.data), 'object',
			testCase.name + ' be a constructor function');
	});
});

QUnit.test('sanitizeRejectData', function (assert) {
	var response = {
			statusCode: 503
		},
		testCases = [
			{
				payload: '',
				response: response,
				expected: {
					exception: {
						code: 503
					},
					payloadString: ''
				}
			},
			{
				payload: 'error',
				response: response,
				expected: {
					exception: {
						code: 503
					},
					payloadString: 'error'
				}
			},
			{
				payload: null,
				response: response,
				expected: {
					exception: {
						code: 503
					},
					payloadString: null
				}
			},
			{
				payload: {},
				response: response,
				expected: {
					exception: {
						code: 503
					}
				}
			},
			{
				payload: {},
				response: response,
				expected: {
					exception: {
						code: 503
					}
				}
			},
			{
				payload: {
					exception: {
						code: 404
					},
					test: true
				},
				response: response,
				expected: {
					exception: {
						code: 404
					},
					test: true
				}
			},
		];

	testCases.forEach(function (testCase) {
		assert.deepEqual(global.sanitizeRejectData(testCase.payload, testCase.response), testCase.expected);
	});
});
