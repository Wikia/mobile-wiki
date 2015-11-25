QUnit.module('domain utility functions', function () {
	QUnit.test('Mercury.Utils.getDomain gets domain from provided hosts', function (assert) {
		var testCases = [
			{
				hostname: 'witcher.wikia.com',
				expected: 'wikia.com'
			},
			{
				hostname: 'fallout.warkot.wikia-dev.com',
				expected: 'wikia-dev.com'
			},
			{
				hostname: 'no-dots-here',
				expected: 'no-dots-here'
			},
			{
				expected: window.location.hostname
			},
		];

		testCases.forEach(function (testCase) {
			assert.strictEqual(require('mercury/utils/domain').getDomain(testCase.hostname), testCase.expected);
		});
	});
});


