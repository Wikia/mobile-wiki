import Ember from 'ember';
import DiscussionParsedContentMixin from '../mixins/discussion-parsed-content';

export default Ember.Component.extend(
	DiscussionParsedContentMixin,
	{
		discussionEditEditor: Ember.inject.service(),
		shouldActivateLinks: true,
		shouldTruncateContent: false,
		wikiName: Ember.get(Mercury, 'wiki.siteName'),

		actions: {
			openGuidelinesEditor() {
				const discussionEditEditor = this.get('discussionEditEditor');

				// discussionEditEditor.set('discussionEntity', post);
				discussionEditEditor.toggleEditor(true);
			},

			generateOpenGraph() {},
		}
	}
);
