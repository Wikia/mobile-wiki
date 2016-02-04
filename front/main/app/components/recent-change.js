import Ember from 'ember';

export default Ember.Component.extend({
	classNames: ['recent-change'],
	unixTimestamp: Ember.computed('model.timestamp', function () {
		return new Date(this.get('model.timestamp')).getTime() / 1000;
	}),
	hasDiff: Ember.computed('model.old_revid', 'model.revid', function () {
		return this.get('model.old_revid') && this.get('model.revid');
	})
});
