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
		adsState: Ember.inject.service(),
		noAds: Ember.computed.readOnly('adsState.noAds'),
		disableManualInsert: false,
		isAboveTheFold: false,
		name: null,

		nameLowerCase: computed('name', function () {
			return Ember.String.dasherize(this.get('name').toLowerCase());
		}),

		onElementManualInsert: Ember.on('didInsertElement', function () {
			const ads = Ads.getInstance(),
				name = this.get('name');

			if (this.get('disableManualInsert')) {
				return;
			}

			if (this.get('noAds')) {
				Logger.info('Ad disabled for:', name);
				return;
			}

			if (this.get('isAboveTheFold')) {
				Logger.info('Injected ad', name);
				ads.addSlot({
					slotName: name,
					onSuccess: this.get('onSuccess')
				});
			} else {
				ads.waitForUapResponse(
					() => {},
					() => {
						Logger.info('Injected ad:', name);
						ads.pushSlotToQueue({
							slotName: name,
							onSuccess: this.get('onSuccess')
						});
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

			if (!this.get('isAboveTheFold')) {
				ads.waitForUapResponse(
					() => {
						Logger.info('Injected ad on scroll:', name);
						ads.pushSlotToQueue({
							slotName: name,
							onSuccess: this.get('onSuccess')
						});
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
