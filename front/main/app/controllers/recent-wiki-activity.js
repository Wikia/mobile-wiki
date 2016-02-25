import Ember from 'ember';

export default Ember.Controller.extend({
	application: Ember.inject.controller(),
	siteHeadPinned: Ember.computed.oneWay('application.siteHeadPinned'),
	queryParams: ['rc'],
	rc: null
});
