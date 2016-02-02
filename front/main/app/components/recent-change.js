import Ember from 'ember';

/**
 */

export default Ember.Component.extend({
	classNames: ['recent-change'],
	unixTimestamp: Ember.computed('change.timestamp', function() {
		return new Date(this.get('change.timestamp')).getTime() / 1000;
	}),
});
