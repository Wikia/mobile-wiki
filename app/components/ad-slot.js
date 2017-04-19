import Ember from 'ember';
import InViewportMixin from 'ember-in-viewport';

const {Component, String: {dasherize}, computed, inject, on, setProperties} = Ember;

export default Component.extend(
	InViewportMixin,
	{
		classNames: ['ad-slot-wrapper'],
		classNameBindings: ['nameLowerCase', 'noAds'],
		// This component is created dynamically, and this won't work without it
		layoutName: 'components/ad-slot',
		ads: inject.service(),
		logger: inject.service(),
		noAds: computed.readOnly('ads.noAds'),
		disableManualInsert: false,
		isAboveTheFold: false,
		name: null,

		nameLowerCase: computed('name', function () {
			return dasherize(this.get('name').toLowerCase());
		}),

		onElementManualInsert: on('didInsertElement', function () {
			const ads = this.get('ads.module'),
				name = this.get('name');

			if (this.get('disableManualInsert')) {
				return;
			}

			if (this.get('noAds')) {
				this.get('logger').info('Ad disabled for:', name);
				return;
			}

			if (this.get('isAboveTheFold')) {
				this.get('logger').info('Injected ad', name);
				ads.addSlot(name);
			} else {
				ads.waitForUapResponse(
					() => {},
					() => {
						this.get('logger').info('Injected ad:', name);
						ads.pushSlotToQueue(name);
					}
				);
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
		didEnterViewport() {
			const ads = this.get('ads.module'),
				name = this.get('name');

			if (this.get('noAds')) {
				this.get('logger').info('Ad disabled for:', name);
				return;
			}

			if (!this.get('isAboveTheFold')) {
				ads.waitForUapResponse(
					() => {
						this.get('logger').info('Injected ad on scroll:', name);
						ads.pushSlotToQueue(name);
					},
					() => {}
				);
			}
		},

		willDestroyElement() {
			const name = this.get('name');

			this.get('logger').info('Will destroy ad:', name);
			this.get('ads.module').removeSlot(name);
		}
	}
);
