import Ember from 'ember';
import {test} from 'ember-qunit';
import AdsMixin from 'main/mixins/ads';
import Ads from 'common/modules/Ads';

QUnit.module('Unit | Mixin | ads', function () {
	test('setup ads context', function (assert) {
		const context = {
				a: 1
			},
			mixin = Ember.Object.extend(AdsMixin).create(),
			original = Ads.getInstance;

		let gotContext = false;

		Ads.getInstance = function () {
			return {
				reload(context) {
					gotContext = context;
				}
			};
		};

		mixin.setupAdsContext(context);
		Ads.getInstance = original;

		assert.equal(gotContext, context, 'Set the ads context');
	});
});


