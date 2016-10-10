QUnit.module('lib/prerender');

QUnit.test('updateRequestedUrl', function (assert) {
	const testCases = [
		{
			in: 'http://muppet.wikia.com/wiki/Miss_Piggy',
			out: 'http://muppet.wikia.com/wiki/Miss_Piggy?useskin=mercury'
		},
		{
			in: 'http://muppet.wikia.com/wiki/Miss_Piggy?useskin=mercury',
			out: 'http://muppet.wikia.com/wiki/Miss_Piggy?useskin=mercury'
		},
		{
			in: 'http://muppet.wikia.com/wiki/Miss_Piggy?some=query&params=present',
			out: 'http://muppet.wikia.com/wiki/Miss_Piggy?some=query&params=present&useskin=mercury'
		},
		{
			in: 'http://muppet.wikia.com/wiki/Miss_Piggy?some=query&params=present&useskin=mercury',
			out: 'http://muppet.wikia.com/wiki/Miss_Piggy?some=query&params=present&useskin=mercury'
		},
		{
			in: 'http://sandbox-s3.muppet.wikia.com/wiki/Miss_Piggy',
			out: 'http://muppet.wikia.com/wiki/Miss_Piggy?useskin=mercury'
		},
		{
			in: 'http://muppet.rychu.wikia-dev.com/wiki/Miss_Piggy',
			out: 'http://muppet.wikia.com/wiki/Miss_Piggy?useskin=mercury'
		},
		{
			in: 'http://muppet.127.0.0.1.xip.io:7000/wiki/Miss_Piggy',
			out: 'http://muppet.wikia.com/wiki/Miss_Piggy?useskin=mercury'
		}
	];

	testCases.forEach(function (testCase) {
		assert.equal(global.prerenderOptions.updateRequestedUrl(testCase.in), testCase.out);
	});
});
