QUnit.module('lib/MediaWiki', {
});

QUnit.test('createURL', function (assert) {
	global.localSettings.default.environment = 'dev';
	global.localSettings.default.devboxDomain = 'test';
	global.localSettings.default.mediawikiDomain = undefined;

	assert.equal(global.createUrl('foo.test.wikia-dev.com', 'api/test', {}),
		'http://foo.test.wikia-dev.com/api/test', 'zero query params');
	assert.equal(global.createUrl('foo.test.wikia-dev.com', 'api/test', {
		title: 'bar'
	}), 'http://foo.test.wikia-dev.com/api/test?title=bar', 'one query param');
	assert.equal(global.createUrl('foo.test.wikia-dev.com', 'api/test', {
		title: 'bar',
		param: 'gibberish'
	}), 'http://foo.test.wikia-dev.com/api/test?title=bar&param=gibberish', 'two query params');
	assert.equal(global.createUrl('foo.test.wikia-dev.com', 'api/test'),
		'http://foo.test.wikia-dev.com/api/test', 'missing query params');

	global.localSettings.default.mediawikiDomain = 'mediawiki.service.consul';
	assert.equal(global.createUrl('foo.test.wikia-dev.com', 'api/test', {}),
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
		},
		{
			name: 'SearchRequest',
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
