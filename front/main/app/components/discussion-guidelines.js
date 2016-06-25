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
			openGuidelinesEditor(post) {
				const discussionEditEditor = this.get('discussionEditEditor');

				discussionEditEditor.toggleEditor(true);
				this.get('popover').deactivate();
			},

			generateOpenGraph() {},
		}
	}
);
