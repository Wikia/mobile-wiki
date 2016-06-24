import Ember from 'ember';
import DiscussionParsedContentMixin from '../mixins/discussion-parsed-content';

export default Ember.Component.extend(
	DiscussionParsedContentMixin,
	{
		activateLinks: true,
		truncateContent: false,
		wikiName: Ember.get(Mercury, 'wiki.siteName'),
	}
);
