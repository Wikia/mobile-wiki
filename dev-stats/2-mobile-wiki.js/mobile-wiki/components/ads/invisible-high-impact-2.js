define('mobile-wiki/components/ads/invisible-high-impact-2', ['exports'], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var Component = Ember.Component,
	    inject = Ember.inject,
	    computed = Ember.computed;
	exports.default = Component.extend({
		ads: inject.service(),

		highImpactCountries: Ember.get(Wikia, 'InstantGlobals.wgAdDriverHighImpact2SlotCountries'),
		noAds: computed.readOnly('ads.noAds'),
		isVisible: false,

		name: 'INVISIBLE_HIGH_IMPACT_2',
		nameLowerCase: computed('name', function () {
			return Ember.String.dasherize(this.get('name').toLowerCase());
		}),

		didInsertElement: function didInsertElement() {
			var _this = this;

			this.get('ads.module').onReady(function () {
				if (_this.isEnabled()) {
					_this.set('isVisible', true);
					_this.get('ads.module').pushSlotToQueue(_this.get('name'));
				}
			});
		},
		willDestroyElement: function willDestroyElement() {
			if (this.isEnabled()) {
				this.get('ads.module').removeSlot(this.get('name'));
			}
		},
		isProperGeo: function isProperGeo(param) {
			var isProperGeo = Ember.get(Wikia, 'geo.isProperGeo');
			return typeof isProperGeo === 'function' && isProperGeo(param);
		},
		isEnabled: function isEnabled() {
			return this.isProperGeo(this.highImpactCountries);
		}
	});
});