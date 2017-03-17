import Ember from 'ember';
import {track, trackActions} from '../utils/track';

const {Component, computed, inject} = Ember;

export default Component.extend({
	classNames: ['wikia-stats'],
	i18n: inject.service(),

	items: computed('model', function () {
		return [
			{
				label: this.get('i18n').t('app.pages-label'),
				value: this.get('model.articles'),
			},
			{
				label: this.get('i18n').t('app.photos-label'),
				value: this.get('model.images'),
			},
			{
				label: this.get('i18n').t('app.videos-label'),
				value: this.get('model.videos'),
			},
			{
				label: this.get('i18n').t('app.discussions-label'),
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
