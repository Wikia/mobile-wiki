moduleFor('mixin:color-utils', 'ColorUtilsMixin');

test('returns rgba values correctly', function () {
	var mixin = getMixin('color-utils');

	deepEqual(mixin.hexToRgb('#ffffff'), {r: 255, g: 255, b: 255, a: 1});
	deepEqual(mixin.hexToRgb('#fc4400', 0.4), {r: 252, g: 68, b: 0, a: 0.4});
	deepEqual(mixin.hexToRgb('#75cccc', 0.1), {r: 117, g: 204, b: 204, a: 0.1});
	deepEqual(mixin.hexToRgb('#333333', 0.9), {r: 51, g: 51, b: 51, a: 0.9});
	deepEqual(mixin.hexToRgb('#000000', 0), {r: 0, g: 0, b: 0, a: 0});

	throws(
		function(){mixin.hexToRgb('33')},
		new Error('hex must be in proper color hex notation')
	);
});

test('returns rgba color correctly', function () {
	var mixin = getMixin('color-utils');

	equal(mixin.getRgbaColor({r: 255, g: 255, b: 255, a: 1}), 'rgba(255, 255, 255, 1)');
	equal(mixin.getRgbaColor({r: 252, g: 60, b: 0, a: 0.4}), 'rgba(252, 60, 0, 0.4)');
	equal(mixin.getRgbaColor({r: 117, g: 204, b: 204, a: 0.1}), 'rgba(117, 204, 204, 0.1)');
	equal(mixin.getRgbaColor({r: 51, g: 51, b: 51, a: 0.9}), 'rgba(51, 51, 51, 0.9)');
	equal(mixin.getRgbaColor({r: 0, g: 0, b: 0, a: 0}), 'rgba(0, 0, 0, 0)');
	equal(mixin.getRgbaColor({r: 14, g: 15, b: 16}), 'rgba(14, 15, 16)');
});

test('returns expanded hex color correctly', function () {
	var mixin = getMixin('color-utils');

	equal(mixin.shortHexColorExpand('#fff'), '#ffffff');
	equal(mixin.shortHexColorExpand('#fc4400'), '#fc4400');
	equal(mixin.shortHexColorExpand('#7cd'), '#77ccdd');
	equal(mixin.shortHexColorExpand('#333333'), '#333333');
	equal(mixin.shortHexColorExpand('#00'), '#00');
	equal(mixin.shortHexColorExpand('33'), '33');
});
