import Ember from 'ember';
import DiscussionParsedContentMixin from '../mixins/discussion-parsed-content';

export default Ember.Component.extend(
	DiscussionParsedContentMixin,
	{
		areLinksActive: true,
		wikiName: Ember.get(Mercury, 'wiki.siteName'),
	}
);
