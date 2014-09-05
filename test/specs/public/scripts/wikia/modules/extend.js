module('extend tests');

test('extends object with another objects properties', function () {
	var testCases = [
		{
			obj: {},
			target: {},
			expected: {},
			description: 'Works with empty objects'
		}, {
			obj: {
				a: 1
			},
			target: {
				b: 2
			},
			expected: {
				a: 1,
				b: 2
			},
			description: 'Complements the target object'
		}, {
			obj: {
				a: 1,
				c: 4
			},
			target: {
				a: 2,
				b: 3
			},
			expected: {
				a: 1,
				b: 3,
				c: 4
			},
			description: 'Overwrites target\'s properties'
		},

	];
	expect(testCases.length);
	testCases.forEach(function (testCase) {
		Wikia.Utils.extend(testCase.target, testCase.obj);
		deepEqual(testCase.target, testCase.expected, testCase.description);
	});
})