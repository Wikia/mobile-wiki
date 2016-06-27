import Ember from 'ember';
import DiscussionParsedContentMixin from '../mixins/discussion-parsed-content';

export default Ember.Component.extend(
	DiscussionParsedContentMixin,
	{
		discussionEditEditor: Ember.inject.service(),
		shouldActivateLinks: true,
		shouldTruncateContent: false,
		wikiName: Ember.get(Mercury, 'wiki.siteName'),
		content: Ember.computed.alias('guidelines.value'),

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
