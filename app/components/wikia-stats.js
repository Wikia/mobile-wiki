import Ember from 'ember';
import {track, trackActions} from '../utils/track';
import i18n from 'npm:i18next';

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
				label: i18n.t('app.discussions-label'),
				url: '/d/f',
				trackingLabel: 'discussions-clicked',
				value: this.get('model.discussions'),
			}
		];
	}),
	actions: {
		trackClick(trackingLabel) {
			track({
				action: trackActions.click,
				category: 'main-page',
				label: trackingLabel
			});
		}
	}
});
