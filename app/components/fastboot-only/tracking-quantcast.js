import Ember from 'ember';
import config from '../../config/environment';

const {Component, inject} = Ember;

export default Component.extend({
	tagName: '',
	wikiVariables: inject.service(),
	account: config.tracking.quantcast
});
