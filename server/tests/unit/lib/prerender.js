QUnit.module('lib/prerender');

QUnit.test('updateRequestedUrl', function (assert) {
	assert.equal(
		global.prerenderOptions.updateRequestedUrl('http://muppet.wikia.com/wiki/Miss_Piggy'),
		'http://muppet.wikia.com/wiki/Miss_Piggy?useskin=mercury',
		'adds ?useskin=mercury'
	);
	assert.equal(
		global.prerenderOptions.updateRequestedUrl('http://muppet.wikia.com/wiki/Miss_Piggy?useskin=mercury'),
		'http://muppet.wikia.com/wiki/Miss_Piggy?useskin=mercury',
		'does not add ?useskin=mercury if already present'
	);
	assert.equal(
		global.prerenderOptions.updateRequestedUrl('http://muppet.wikia.com/wiki/Miss_Piggy?some=query&params=present'),
		'http://muppet.wikia.com/wiki/Miss_Piggy?some=query&params=present&useskin=mercury',
		'adds &useskin=mercury if some query params present'
	);
	assert.equal(
		global.prerenderOptions.updateRequestedUrl(
			'http://muppet.wikia.com/wiki/Miss_Piggy?some=query&params=present&useskin=mercury'
		),
		'http://muppet.wikia.com/wiki/Miss_Piggy?some=query&params=present&useskin=mercury',
		'does not add &useskin=mercury if already present'
	);
	assert.equal(
		global.prerenderOptions.updateRequestedUrl('http://sandbox-s3.muppet.wikia.com/wiki/Miss_Piggy'),
		'http://muppet.wikia.com/wiki/Miss_Piggy?useskin=mercury',
		'removes sandbox-* part and adds ?useskin=mercury'
	);
	assert.equal(
		global.prerenderOptions.updateRequestedUrl('http://muppet.rychu.wikia-dev.com/wiki/Miss_Piggy'),
		'http://muppet.wikia.com/wiki/Miss_Piggy?useskin=mercury',
		'redirect wikia-dev to production and adds ?useskin=mercury'
	);
	assert.equal(
		global.prerenderOptions.updateRequestedUrl('http://muppet.127.0.0.1.xip.io:7000/wiki/Miss_Piggy'),
		'http://muppet.wikia.com/wiki/Miss_Piggy?useskin=mercury',
		'redirect xip.io to production and adds ?useskin=mercury'
	);
});
