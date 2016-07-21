import Ember from 'ember';
import DiscussionBaseRoute from './base';
import RouteWithBodyClassNameMixin from '../../mixins/route-with-body-class-name';

export default DiscussionBaseRoute.extend(
	RouteWithBodyClassNameMixin,
	{
		bodyClassNames: ['standalone-page'],
		discussionEditEditor: Ember.inject.service(),

		model() {
			const indexModel = this.modelFor('discussion');

			return Ember.RSVP.hash({
				attributes: indexModel.attributes,
			});
		},
	}
);
