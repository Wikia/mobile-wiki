import Ember from 'ember';

const {Component, inject, computed} = Ember;

export default Component.extend({
	adsHighImpact: inject.service(),
	ads: inject.service(),

	name: computed.readOnly('adsHighImpact.name'),
	noAds: computed.readOnly('ads.noAds'),

	nameLowerCase: computed('name', function () {
		return Ember.String.dasherize(this.get('name').toLowerCase());
	}),

	didInsertElement() {
		this.set('adsHighImpact.component', this);
	},

	willDestroyElement() {
		if (this.get('adsHighImpact').isFloorAdhesionEnabled()) {
			this.get('ads.module').removeSlot(this.get('name'));
			this.$().remove();
		}
	}
});
