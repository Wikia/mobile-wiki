import Ember from 'ember';

const {Component, inject, computed} = Ember;

export default Component.extend({
	adsHighImpact: inject.service(),
	adsState: inject.service(),

	hidden: true,
	name: computed.readOnly('adsHighImpact.name'),
	noAds: computed.readOnly('adsState.noAds'),
	type: computed('adsHighImpact.type', function () {
		if (this.get('adsHighImpact.type') === 'interstitial') {
			// we want to show the interstitial before the ad is loaded
			// it gives us the nice "slide from bottom" effect
			this.set('hidden', false);
			return 'slide-bottom-top';
		}
	}),

	nameLowerCase: computed('name', function () {
		return Ember.String.dasherize(this.get('name').toLowerCase());
	}),

	actions: {
		close() {
			this.set('hidden', true);
			this.set('adsHighImpact.type', '');
		}
	}
});
