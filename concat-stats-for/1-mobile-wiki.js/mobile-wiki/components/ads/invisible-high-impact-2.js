define('mobile-wiki/components/ads/invisible-high-impact-2', ['exports'], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var service = Ember.inject.service;
	var readOnly = Ember.computed.readOnly;
	var dasherize = Ember.String.dasherize;
	var Component = Ember.Component;
	var computed = Ember.computed;
	var get = Ember.get;
	exports.default = Component.extend({
		ads: service(),

		highImpactCountries: get(Wikia, 'InstantGlobals.wgAdDriverHighImpact2SlotCountries'),
		noAds: readOnly('ads.noAds'),
		isVisible: false,

		name: 'INVISIBLE_HIGH_IMPACT_2',
		nameLowerCase: computed('name', function () {
			return dasherize(this.get('name').toLowerCase());
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
			var isProperGeo = get(Wikia, 'geo.isProperGeo');
			return typeof isProperGeo === 'function' && isProperGeo(param);
		},
		isEnabled: function isEnabled() {
			return this.isProperGeo(this.highImpactCountries);
		}
	});
});