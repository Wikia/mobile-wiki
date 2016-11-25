QUnit.module('lib/hashing');

QUnit.test('gaUserIdHash', function (assert) {
	global.settings.default.gaUserSalt = 'foo';

	assert.equal(
		global.gaUserIdHash(0),
		'',
		'for no given userId (userId == 0)'
	);
	assert.equal(
		global.gaUserIdHash(1),
		'7c3594f6ac211ce905662eea58ed5595',
		'for given userId'
	);
});

QUnit.test('md5', function (assert) {
	var testCases = [
		{
			string: '',
			md5: 'd41d8cd98f00b204e9800998ecf8427e'
		},
		{
			string: 'foobar',
			md5: '3858f62230ac3c915f300c664312c63f'
		},
		{
			string: '1234567890',
			md5: 'e807f1fcf82d132f9bb018ca6738a19f'
		},
	];

	testCases.forEach(function (testCase) {
		assert.equal(global.md5(testCase.string), testCase.md5, testCase.string + ' not computed right');
	});
});
