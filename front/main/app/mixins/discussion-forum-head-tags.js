import Ember from 'ember';
import HeadTagsDynamicMixin from './head-tags-dynamic';

export default Ember.Mixin.create(
	HeadTagsDynamicMixin,
	{
		discussionSeoUrlBuilder: Ember.inject.service(),

		setDynamicHeadTags(model, data = {}) {
			const queryParams = this.get('router.router.state.queryParams');

			data.next = this.get('discussionSeoUrlBuilder').nextPageUrl(model.current.get('data.postCount'));
			data.prev = this.get('discussionSeoUrlBuilder').prevPageUrl();

			this._super(model, data);
		},
	}
);
