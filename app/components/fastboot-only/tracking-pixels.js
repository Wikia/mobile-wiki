import Ember from 'ember';

const {Component, computed, inject} = Ember;

export default Component.extend({
	tagName: '',
	tracking: inject.service(),
	comscore: computed.reads('tracking.config.comscore'),
	quantcast: computed.reads('tracking.config.quantcast')
});
