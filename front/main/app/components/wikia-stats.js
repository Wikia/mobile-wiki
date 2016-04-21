import Ember from 'ember';
import {track, trackActions} from '../utils/discussion-tracker';

export default Ember.Component.extend({
	classNames: ['wikia-stats'],

	items: Ember.computed('model', function () {
		return [
			{
				label: i18n.t('app.pages-label'),
				value: this.get('model.articles'),
			},
			{
				label: i18n.t('app.photos-label'),
				value: this.get('model.images'),
			},
			{
				label: i18n.t('app.videos-label'),
				value: this.get('model.videos'),
			},
			{
				label: i18n.t('main.discussions-header-title', {ns:'discussion'}),
				routeName: 'discussion.index',
				value: this.get('model.discussions'),
			}
		];
	}),
	actions: {
		discussionsClicked() {
			track(trackActions.articleToDiscussions);
		}
	}
});
