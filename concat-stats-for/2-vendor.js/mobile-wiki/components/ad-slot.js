define('mobile-wiki/components/ad-slot', ['exports', 'ember-in-viewport'], function (exports, _emberInViewport) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var service = Ember.inject.service;
	var readOnly = Ember.computed.readOnly;
	var Component = Ember.Component;
	var dasherize = Ember.String.dasherize;
	var on = Ember.on;
	var setProperties = Ember.setProperties;
	var computed = Ember.computed;
	exports.default = Component.extend(_emberInViewport.default, {
		classNames: ['ad-slot-wrapper'],
		classNameBindings: ['nameLowerCase', 'noAds'],
		// This component is created dynamically, and this won't work without it
		layoutName: 'components/ad-slot',
		ads: service(),
		logger: service(),
		noAds: readOnly('ads.noAds'),
		disableManualInsert: false,
		isAboveTheFold: false,
		name: null,
		pageHasFeaturedVideo: false,

		nameLowerCase: computed('name', function () {
			return dasherize(this.get('name').toLowerCase());
		}),

		shouldWaitForUapResponse: computed('pageHasFeaturedVideo', 'isAboveTheFold', function () {
			return !(this.get('pageHasFeaturedVideo') || this.get('isAboveTheFold'));
		}),

		onElementManualInsert: on('didInsertElement', function () {
			var _this = this;

			var ads = this.get('ads.module'),
			    name = this.get('name');

			if (this.get('disableManualInsert')) {
				return;
			}

			if (this.get('noAds')) {
				this.get('logger').info('Ad disabled for:', name);
				return;
			}

			if (this.get('shouldWaitForUapResponse')) {
				ads.waitForUapResponse(function () {}, function () {
					_this.get('logger').info('Injected ad:', name);
					ads.pushSlotToQueue(name);
				});
			} else {
				this.get('logger').info('Injected ad', name);
				ads.pushSlotToQueue(name);
			}

			setProperties(this, {
				viewportTolerance: {
					top: 200,
					bottom: 200
				}
			});
		}),

		/**
   * @returns {void}
   */
		didEnterViewport: function didEnterViewport() {
			var _this2 = this;

			var ads = this.get('ads.module'),
			    name = this.get('name');

			if (this.get('noAds')) {
				this.get('logger').info('Ad disabled for:', name);
				return;
			}

			if (this.get('shouldWaitForUapResponse')) {
				ads.waitForUapResponse(function () {
					_this2.get('logger').info('Injected ad on scroll:', name);
					ads.pushSlotToQueue(name);
				}, function () {});
			}
		},
		willDestroyElement: function willDestroyElement() {
			var name = this.get('name');

			this.get('logger').info('Will destroy ad:', name);
			this.get('ads.module').removeSlot(name);
		}
	});
});