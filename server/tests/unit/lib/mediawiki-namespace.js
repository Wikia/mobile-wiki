QUnit.module('lib/mediawiki');

QUnit.test('isContentNamespace', function (assert) {
	var testCases = [
		{
			contentNamespaces: [0, 112],
			namespace: 112,
			expected: true
		}, {
			contentNamespaces: [0, 112],
			namespace: 14,
			expected: false
		}, {
			contentNamespaces: [0, '112'],
			namespace: 112,
			expected: true
		}, {
			contentNamespaces: [0, 112],
			namespace: 0,
			expected: true
		}
	];

	testCases.forEach(function (testCase) {
		assert.equal(global.isContentNamespace(testCase.namespace, testCase.contentNamespaces), testCase.expected);
	});
});
