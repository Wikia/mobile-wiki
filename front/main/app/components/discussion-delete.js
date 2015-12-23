import Ember from 'ember';
import {checkPermissions} from '../../mercury/utils/discussionPermissions';

export default Ember.Component.extend({
	classNames: ['delete-actions'],
	tagName: 'div',

	canDelete: Ember.computed('post.isDeleted', function () {
		return !this.get('post.isDeleted') && checkPermissions(this.get('post'), 'canDelete');
	}),

	canUndelete: Ember.computed('post.isDeleted', function () {
		return this.get('post.isDeleted') && checkPermissions(this.get('post'), 'canUndelete');
	}),
});
