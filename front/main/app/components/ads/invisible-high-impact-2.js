import Ember from 'ember';

export default Ember.Component.extend({
	adsHighImpact: Ember.inject.service(),

	name: Ember.computed.readOnly('adsHighImpact.name')
});
