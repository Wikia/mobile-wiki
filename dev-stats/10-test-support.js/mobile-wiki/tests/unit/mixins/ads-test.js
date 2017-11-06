define('mobile-wiki/tests/unit/mixins/ads-test', ['ember-qunit', 'mobile-wiki/mixins/ads', 'sinon'], function (_emberQunit, _ads, _sinon) {
	'use strict';

	var adsStub = Ember.Service.extend({
		module: {
			reloadAfterTransition: function reloadAfterTransition() {}
		}
	});

	(0, _emberQunit.moduleFor)('mixin:ads', 'Unit | Mixin | ads', {
		unit: true,
		needs: ['service:currentUser', 'service:fastboot', 'service:logger', 'service:wiki-variables'],

		beforeEach: function beforeEach() {
			this.register('service:ads', adsStub);
			this.inject.service('ads', { as: 'ads' });
		},
		subject: function subject() {
			var AdsObject = Ember.Object.extend(_ads.default);

			this.register('test-container:ads-object', AdsObject);

			return Ember.getOwner(this).lookup('test-container:ads-object');
		}
	});

	(0, _emberQunit.test)('setup ads context', function (assert) {
		var context = {
			a: 1
		},
		    mixin = this.subject(),
		    reloadSpy = _sinon.default.spy(mixin.get('ads.module'), 'reloadAfterTransition');

		mixin.setupAdsContext(context);

		assert.ok(reloadSpy.calledWith(context), 'Set the ads context');
	});
});