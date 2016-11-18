import Ember from 'ember';
import HeadTagsDynamicMixin from './head-tags-dynamic';

export default Ember.Mixin.create(
	HeadTagsDynamicMixin,
	{
		discussionSeoUrlBuilder: Ember.inject.service(),

		setDynamicHeadTags(model, data = {}) {
			const discussionSeoUrlBuilder = this.get('discussionSeoUrlBuilder');

			data.next = discussionSeoUrlBuilder.getNextPageUrl(model.current.get('data.postCount'));
			data.prev = discussionSeoUrlBuilder.getPrevPageUrl();

			this._super(model, data);
		},
	}
);
