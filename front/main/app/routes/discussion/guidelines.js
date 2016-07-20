import Ember from 'ember';
import DiscussionBaseRoute from './base';
import RouteWithBodyClassNameMixin from '../../mixins/route-with-body-class-name';
import {track, trackActions} from '../../utils/discussion-tracker';

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
	
		actions: {
			saveGuidelines(text) {
				this.modelFor('discussion').attributes.saveAttribute('guidelines', text).then(() => {
					this.get('discussionEditEditor').trigger('newGuidelines');
					track(trackActions.GuidelinesEditSave);
				}).catch((err) => {
					this.onContributionError(err, 'editor.save-error-general-error', true);
				}).finally(() => {
					this.get('discussionEditEditor').set('isLoading', false);
				});
			},
		}
	}
);
