import Ember from 'ember';

const {Component, computed, inject} = Ember;

export default Component.extend({
	tagName: '',
	tracking: inject.service(),

	config: computed.reads('tracking.config.ivw3'),
	countries: computed(function () {
		return JSON.stringify(this.get('config.countries'));
	})
});
