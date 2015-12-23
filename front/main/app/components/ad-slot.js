import Ember from 'ember';
import Ads from '../../mercury/modules/Ads';

export default Ember.Component.extend({
	classNames: ['ad-slot-wrapper'],
	classNameBindings: ['nameLowerCase', 'noAds'],
	// This component is created dynamically, and this won't work without it
	layoutName: 'components/ad-slot',

	name: null,

	nameLowerCase: Ember.computed('name', function () {
		return this.get('name').toLowerCase().dasherize();
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
	noAds: Ember.computed({
		get() {
			return false;
		},
		set(key, value) {
			return value !== '' && value !== '0';
		}
	}),

	/**
	 * @returns {void}
	 */
	didInsertElement() {
		if (this.get('noAds') === true) {
			Ember.Logger.info('Ad disabled for:', this.get('name'));
		} else {
			Ember.Logger.info('Injected ad:', this.get('name'));
			Ads.getInstance().addSlot(this.get('name'));
		}
	},

	/**
	 * @returns {void}
	 */
	willDestroyElement() {
		const name = this.get('name');

		Ads.getInstance().removeSlot(this.get('name'));
		this.$().remove();

		Ember.Logger.info('Will destroy ad:', name);
	},
});
