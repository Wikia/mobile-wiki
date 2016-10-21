import Ember from 'ember';

const {Component, inject, computed} = Ember;

export default Component.extend({
	adsHighImpact: inject.service(),
	ads: inject.service(),

	name: computed.readOnly('adsHighImpact.name'),
	layoutName: 'components/ads/invisible-high-impact-2',
	noAds: computed.readOnly('ads.noAds'),

	nameLowerCase: computed('name', function () {
		return Ember.String.dasherize(this.get('name').toLowerCase());
	}),

	didInsertElement() {
		this.get('ads.module').addSlot(this.get('name'));
		this.get('ads').pushInContentAd(this.get('name'), this);
	},

	willDestroyElement() {
		this.get('ads.module').removeSlot(this.get('name'));
		this.$().remove();
	}
});
