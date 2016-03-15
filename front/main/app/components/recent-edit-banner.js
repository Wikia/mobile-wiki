import Ember from 'ember';
import {track, trackActions} from 'common/utils/track';
import BottomBanner from './bottom-banner';
import TrackClickMixin from '../mixins/track-click';
import RecentWikiActivityModel from '../models/recent-wiki-activity';

export default BottomBanner.extend(
	TrackClickMixin,
	{
		classNames: ['recent-edit'],
		recentEdit: null,
		recentWikiActivityLink: '/recent-wiki-activity',
		timeoutId: null,

		init() {
			this._super(...arguments);
			RecentWikiActivityModel.getRecentActivityList(1, 'user|timestamp|title').then((recentEdit) => {
				this.setProperties({
					loaded: true,
					recentEdit: recentEdit.recentChanges.get('firstObject')
				});

				this.set('timeoutId', Ember.run.later(this, () => {
					this.dismissRecentEdit(1, 'postponed');
				}, 7000));

				track({
					action: trackActions.impression,
					category: 'recent-edit-banner',
					label: 'displayed'
				});
			});

		},

		sendTracking(label) {
			this.trackClick('recent-edit-banner', label);
		},

		dismissRecentEdit(expires, label) {
			this.setCookie('recent-edit-dismissed', 1, expires);
			this.sendTracking(label);
			this.set('dismissed', true);

			if (this.get('timeoutId')) {
				Ember.run.cancel(this.get('timeoutId'));
			}
		},

		actions: {
			dismiss(label) {
				this.dismissRecentEdit(10 * 365, label);
			}
		}
	}
);
