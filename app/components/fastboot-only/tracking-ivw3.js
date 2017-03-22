import Ember from 'ember';

const {Component, computed, inject} = Ember;

export default Component.extend({
	tagName: '',
	tracking: inject.service(),

	config: computed.reads('tracking.config.ivw3'),
	enabled: computed(function () {
		const config = this.get('config');

		return config && config.countries &&
			typeof config.countries.indexOf === 'function' &&
			config.countries.indexOf('AT') !== -1; //FIXME use geo.country
	})
});
