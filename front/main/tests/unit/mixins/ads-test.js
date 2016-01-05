import Ember from 'ember';
import {test} from 'ember-qunit';
import {module} from 'qunit';
import AdsMixin from 'main/mixins/ads';
import Ads from 'common/modules/Ads';

module('Unit | Mixin | ads', () => {
	test('setup ads context', (assert) => {
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


