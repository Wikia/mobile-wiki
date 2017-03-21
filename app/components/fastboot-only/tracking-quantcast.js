import Ember from 'ember';

const {Component, computed, inject} = Ember;

export default Component.extend({
	tagName: '',
	wikiVariables: inject.service(),
	tracking: inject.service(),
	account: computed.reads('tracking.config.quantcast'),

	src: computed(function () {
		const prefix = this.get('fastboot.request.protocol') === 'https:' ? 'https://secure' : 'http://edge';

		return `${prefix}.quantserve.com/quant.js?${Math.random()}`;
	})
});
