import Ember from 'ember';

const LightboxAdsComponent = Ember.Component.extend({
	classNames: ['lightbox-ads', 'lightbox-content-inner'],

	/**
	 * @returns {void}
	 */
	didInsertElement() {
		this.sendAction('setHeader', 'Advertisement');
	}
});

export default LightboxAdsComponent;
