QUnit.module('domain utility functions');

test('Mercury.Utils.getDomain gets domain from provided hosts', function () {
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
		strictEqual(require('mercury/utils/domain').getDomain(testCase.hostname), testCase.expected);
	});
});
