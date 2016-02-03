import Ember from 'ember';

export default Ember.Component.extend({
	classNames: ['recent-change'],
	unixTimestamp: Ember.computed('model.timestamp', function () {
		return new Date(this.get('model.timestamp')).getTime() / 1000;
	})
});
