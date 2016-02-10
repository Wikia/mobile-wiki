import Ember from 'ember';

export default Ember.Component.extend({
	classNames: ['recent-change'],
	hasDiff: Ember.computed.and('model.old_revid', 'model.revid'),
	showDiffLink: true
});
