import {getOwner} from '@ember/application';
import EmberObject from '@ember/object';
import Service from '@ember/service';
import {moduleFor, test} from 'ember-qunit';
import AdsMixin from 'mobile-wiki/mixins/ads';
import sinon from 'sinon';

const adsStub = Service.extend({
	module: {
		reloadAfterTransition: () => {}
	}
});

moduleFor('mixin:ads', 'Unit | Mixin | ads', {
	unit: true,
	needs: [
		'service:currentUser',
		'service:fastboot',
		'service:logger',
		'service:wiki-variables'
	],

	beforeEach() {
		this.register('service:ads', adsStub);
		this.inject.service('ads', {as: 'ads'});
	},

	subject() {
		const AdsObject = EmberObject.extend(AdsMixin);

		this.register('test-container:ads-object', AdsObject);

		return getOwner(this).lookup('test-container:ads-object');
	}
});

test('setup ads context', function (assert) {
	const context = {
			a: 1
		},
		mixin = this.subject(),
		reloadSpy = sinon.spy(mixin.get('ads.module'), 'reloadAfterTransition');


	mixin.setupAdsContext(context);

	assert.ok(reloadSpy.calledWith(context), 'Set the ads context');
});
