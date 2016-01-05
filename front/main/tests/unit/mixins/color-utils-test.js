import {test} from 'ember-qunit';
import {module} from 'qunit';
import ColorUtilsMixin from 'main/mixins/color-utils';

module('Unit | Mixin | color-utils', () => {
	test('returns rgba values correctly', (assert) => {
		const mixin = Ember.Object.extend(ColorUtilsMixin).create();

		assert.deepEqual(mixin.hexToRgb('#ffffff'), {r: 255, g: 255, b: 255, a: 1});
		assert.deepEqual(mixin.hexToRgb('#fc4400', 0.4), {r: 252, g: 68, b: 0, a: 0.4});
		assert.deepEqual(mixin.hexToRgb('#75cccc', 0.1), {r: 117, g: 204, b: 204, a: 0.1});
		assert.deepEqual(mixin.hexToRgb('#333333', 0.9), {r: 51, g: 51, b: 51, a: 0.9});
		assert.deepEqual(mixin.hexToRgb('#000000', 0), {r: 0, g: 0, b: 0, a: 0});

		assert.throws(
			() => mixin.hexToRgb('33'),
			new Error('hex must be in proper color hex notation')
		);
	});

	test('returns rgba color correctly', (assert) => {
		const mixin = Ember.Object.extend(ColorUtilsMixin).create();

		assert.equal(mixin.getRgbaColor({r: 255, g: 255, b: 255, a: 1}), 'rgba(255, 255, 255, 1)');
		assert.equal(mixin.getRgbaColor({r: 252, g: 60, b: 0, a: 0.4}), 'rgba(252, 60, 0, 0.4)');
		assert.equal(mixin.getRgbaColor({r: 117, g: 204, b: 204, a: 0.1}), 'rgba(117, 204, 204, 0.1)');
		assert.equal(mixin.getRgbaColor({r: 51, g: 51, b: 51, a: 0.9}), 'rgba(51, 51, 51, 0.9)');
		assert.equal(mixin.getRgbaColor({r: 0, g: 0, b: 0, a: 0}), 'rgba(0, 0, 0, 0)');
		assert.equal(mixin.getRgbaColor({r: 14, g: 15, b: 16}), 'rgba(14, 15, 16)');
	});

	test('returns expanded hex color correctly', (assert) => {
		const mixin = Ember.Object.extend(ColorUtilsMixin).create();

		assert.equal(mixin.shortHexColorExpand('#fff'), '#ffffff');
		assert.equal(mixin.shortHexColorExpand('#fc4400'), '#fc4400');
		assert.equal(mixin.shortHexColorExpand('#7cd'), '#77ccdd');
		assert.equal(mixin.shortHexColorExpand('#333333'), '#333333');
		assert.equal(mixin.shortHexColorExpand('#00'), '#00');
		assert.equal(mixin.shortHexColorExpand('33'), '33');
	});
});
