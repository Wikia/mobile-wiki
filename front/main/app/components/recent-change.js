import Ember from 'ember';

export default Ember.Component.extend({
	classNames: ['recent-change'],
	hasDiff: Ember.computed('model.old_revid', 'model.revid', function () {
		return this.get('model.old_revid') && this.get('model.revid');
	}),
	showDiffLink: true,
	unixTimestamp: Ember.computed('model.timestamp', function () {
		return new Date(this.get('model.timestamp')).getTime() / 1000;
	}),
});
