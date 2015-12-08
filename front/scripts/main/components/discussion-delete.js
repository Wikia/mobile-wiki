import App from '../app';
import {checkPermissions} from '../../mercury/utils/discussionPermissions';

export default App.DiscussionDeleteComponent = Ember.Component.extend({
	classNames: ['delete-actions'],
	tagName: 'div',

	canDelete: Ember.computed('post.isDeleted', function () {
		return !this.get('post.isDeleted') && checkPermissions(this.get('post'), 'canDelete');
	}),

	canUndelete: Ember.computed('post.isDeleted', function () {
		return this.get('post.isDeleted') && checkPermissions(this.get('post'), 'canUndelete');
	}),
});
