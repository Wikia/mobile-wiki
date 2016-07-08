import Ember from 'ember';
import Ads from 'common/modules/ads';
import InViewportMixin from 'ember-in-viewport';

const {Component, computed, Logger} = Ember;

export default Component.extend(
	InViewportMixin,
	{
		classNames: ['ad-slot-wrapper'],
		classNameBindings: ['nameLowerCase', 'noAds'],
		// This component is created dynamically, and this won't work without it
		layoutName: 'components/ad-slot',

		name: null,

		nameLowerCase: computed('name', function () {
			return Ember.String.dasherize(this.get('name').toLowerCase());
		}),

		/**
		 * noAds is being passed from ApplicationController (queryParams)
		 * as a string and is converted to boolean here
		 *
		 * The same is happening in AdEngine2PageTypeService.class.php
		 * $wgRequest->getBool('noads', false)
		 *
		 * If getter is accessed before setter (before Ember cache is filled with value)
		 * the default is false (show ads)
		 */
		noAds: computed({
			get() {
				return false;
			},
			set(key, value) {
				return value !== '' && value !== '0';
			}
		}),

		onElementManualInsert: Ember.on('didInsertElement', function () {
			const ads = Ads.getInstance(),
				name = this.get('name');

			if (this.get('noAds')) {
				Logger.info('Ad disabled for:', name);
				return;
			}

			if (ads.getBtfSlots().indexOf(name) === -1) {
				Logger.info('Injected ad', name);
				ads.addSlot(name);
			} else {
				ads.waitForUapResponse(
					() => {},
					() => {
						Logger.info('Injected ad:', name);
						ads.pushSlotToQueue(name);
					}
				);
			}

			Ember.setProperties(this, {
				viewportTolerance: {
					top: 200,
					bottom: 200
				}
			});
		}),

		/**
		 * @returns {void}
		 */
		didEnterViewport() {
			const ads = Ads.getInstance(),
				name = this.get('name');

			if (this.get('noAds')) {
				Logger.info('Ad disabled for:', name);
				return;
			}

			if (ads.getBtfSlots().indexOf(name) > -1) {
				ads.waitForUapResponse(
					() => {
						Logger.info('Injected ad on scroll:', name);
						ads.pushSlotToQueue(name);
					},
					() => {}
				);
			}
		},

		/**
		 * @returns {void}
		 */
		willDestroyElement() {
			const name = this.get('name');

			Ads.getInstance().removeSlot(name);
			this.$().remove();
			Logger.info('Will destroy ad:', name);
		}
	}
);
