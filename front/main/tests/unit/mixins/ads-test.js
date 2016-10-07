import Ember from 'ember';
import {moduleFor, test} from 'ember-qunit';
import AdsMixin from 'main/mixins/ads';
import sinon from 'sinon';

const adsStub = Ember.Service.extend({
	module: {
		reload: () => {}
	}
});

moduleFor('mixin:ads', 'Unit | Mixin | ads', {
	unit: true,
	needs: [
		'service:adsHighImpact'
	],

	beforeEach() {
		this.register('service:ads', adsStub);
		this.inject.service('ads', {as: 'ads'});
	},

	subject() {
		const AdsObject = Ember.Object.extend(AdsMixin);

		this.register('test-container:ads-object', AdsObject);

		return Ember.getOwner(this).lookup('test-container:ads-object');
	}
});

test('setup ads context', function (assert) {
	const context = {
			a: 1
		},
		mixin = this.subject(),
		reloadSpy = sinon.spy(mixin.get('ads.module'), 'reload');


	mixin.setupAdsContext(context);

	assert.ok(reloadSpy.calledWith(context), 'Set the ads context');
});
