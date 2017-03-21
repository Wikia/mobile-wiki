import Ember from 'ember';

const {Component, computed, inject} = Ember;

export default Component.extend({
	tagName: '',
	tracking: inject.service(),
	config: computed.reads('tracking.config.netzathleten'),

	enabled: computed(function () {
		const config = this.get('config');

		return config.enabled && config.url;
	})
});
