import Ember from 'ember';

const {Component, inject, computed} = Ember;

export default Component.extend({
	adsHighImpact: inject.service(),
	adsState: inject.service(),

	hidden: computed.not('adsHighImpact.loaded'),
	name: computed.readOnly('adsHighImpact.name'),
	noAds: computed.readOnly('adsState.noAds'),

	nameLowerCase: computed('name', function () {
		return Ember.String.dasherize(this.get('name').toLowerCase());
	}),

	actions: {
		close() {
			this.set('adsHighImpact.loaded', false);
		}
	}
});
