import Ember from 'ember';

export default Ember.Component.extend({
	classNames: ['diff-page'],
	currentUser: Ember.inject.service(),
	userNotBlocked: Ember.computed.not('currentUser.isBlocked'),
	showUndoButton: Ember.computed.and('currentUser.isAuthenticated', 'userNotBlocked'),
	showDiffLink: false
});
