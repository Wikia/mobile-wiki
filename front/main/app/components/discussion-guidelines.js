import Ember from 'ember';
import DiscussionParsedContentMixin from '../mixins/discussion-parsed-content';

export default Ember.Component.extend(
	DiscussionParsedContentMixin,
	{
		areLinksActive: true,
		discussionEditEditor: Ember.inject.service(),
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
