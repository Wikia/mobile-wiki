import Ember from 'ember';
import {checkPermissions} from 'common/utils/discussion-permissions';

export default Ember.Component.extend({
	classNames: ['more-options'],
	tagName: 'ul',
	currentUser: Ember.inject.service(),

	canDelete: Ember.computed('post.isDeleted', function () {
		return !this.get('post.isDeleted') && checkPermissions(this.get('post'), 'canDelete');
	}),

	canUndelete: Ember.computed('post.isDeleted', function () {
		return this.get('post.isDeleted') && checkPermissions(this.get('post'), 'canUndelete');
	}),

	canDeleteOrUndelete: Ember.computed.or('canDelete', 'canUndelete'),

	canReport: Ember.computed('currentUser.isAuthenticated', 'post._embedded.userData.@each.hasReported', function () {
		return this.get('post._embedded.userData.0.hasReported') !== true &&
			this.get('currentUser.isAuthenticated') === true;
	}),
});
