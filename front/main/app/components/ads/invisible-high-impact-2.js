const {Component, inject, computed} = Ember;

export default Component.extend({
	adsHighImpact: inject.service(),
	adsState: inject.service(),

	name: computed.readOnly('adsHighImpact.name'),
	noAds: computed.readOnly('adsState.noAds'),

	nameLowerCase: computed('name', function () {
		return Ember.String.dasherize(this.get('name').toLowerCase());
	})
});
