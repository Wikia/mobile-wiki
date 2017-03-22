import Ember from 'ember';

const {Component, computed, inject} = Ember;

export default Component.extend({
	tagName: '',
	currentUser: inject.service(),
	tracking: inject.service(),

	config: computed.reads('tracking.config.netzathleten'),
	isMainPage: computed.reads('pageModel.isMainPage'),

	enabled: computed(function () {
		const config = this.get('config');

		return config.enabled && config.url && !this.get('currentUser.isAuthenticated');
	})
});
