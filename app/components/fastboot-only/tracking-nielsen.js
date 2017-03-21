import Ember from 'ember';

const {Component, computed, inject} = Ember;

export default Component.extend({
	tagName: '',
	tracking: inject.service(),
	config: computed.reads('tracking.config.nielsen'),
});
