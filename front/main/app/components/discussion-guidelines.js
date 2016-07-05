import Ember from 'ember';
import DiscussionParsedContentMixin from '../mixins/discussion-parsed-content';

export default Ember.Component.extend(
	DiscussionParsedContentMixin,
	{
		canEdit: Ember.computed.and('currentUser.isAuthenticated', 'guidelines.permissions.canEdit'),
		content: Ember.computed.alias('guidelines.value'),
		currentUser: Ember.inject.service(),
		discussionEditEditor: Ember.inject.service(),
		shouldActivateLinks: true,
		shouldTruncateContent: false,
		wikiName: Ember.get(Mercury, 'wiki.siteName'),

		actions: {
			openGuidelinesEditor() {
				const discussionEditEditor = this.get('discussionEditEditor');

				discussionEditEditor.set('guidelines', this.get('guidelines'));
				discussionEditEditor.toggleEditor(true);
			},

			generateOpenGraph() {},
		}
	}
);
