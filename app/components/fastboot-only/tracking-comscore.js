import Ember from 'ember';

const {Component, computed, inject} = Ember;

export default Component.extend({
	tagName: '',
	fastboot: inject.service(),
	tracking: inject.service(),
	config: computed.reads('tracking.config.comscore'),

	src: computed(function () {
		const prefix = this.get('fastboot.request.protocol') === 'https:' ? 'https://sb' : 'http://b';

		return `${prefix}.scorecardresearch.com/beacon.js`;
	})
});
