import { getOwner } from '@ember/application';
import EmberObject from '@ember/object';
import Service from '@ember/service';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import AdsMixin from 'mobile-wiki/mixins/ads';
import sinon from 'sinon';

const adsStub = Service.extend({
	module: (function () {
		return {
			afterTransition: () => {},
		};
	}()),
});

module('Unit | Mixin | ads', (hooks) => {
	setupTest(hooks);

	hooks.beforeEach(function () {
		this.subject = function () {
			const AdsObject = EmberObject.extend(AdsMixin);

			this.owner.register('test-container:ads-object', AdsObject);

			return this.owner.lookup('test-container:ads-object');
		};
	});

	hooks.beforeEach(function () {
		this.owner.register('service:ads', adsStub);
		this.ads = this.owner.lookup('service:ads');
	});

	test('setup ads context', function (assert) {
		const context = {
			a: 1,
		};
		const mixin = this.subject();
		const reloadSpy = sinon.spy(mixin.get('ads.module'), 'afterTransition');

		mixin.setupAdsContext(context);

		assert.ok(reloadSpy.calledWith(context), 'Set the ads context');
	});
});
