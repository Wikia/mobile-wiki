import Ember from 'ember';
import config from '../../config/environment';

const {Component, computed, inject} = Ember;

export default Component.extend({
	tagName: '',
	wikiVariables: inject.service(),
	account: config.tracking.quantcast,

	src: computed(function () {
		const prefix = this.get('fastboot.request.protocol') === 'https:' ? 'https://secure' : 'http://edge';

		return `${prefix}.quantserve.com/quant.js?${Math.random()}`;
	})
});
