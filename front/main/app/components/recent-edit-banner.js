import Ember from 'ember';
import {track, trackActions} from 'common/utils/track';
import BottomBannerMixin from '../mixins/bottom-banner';
import TrackClickMixin from '../mixins/track-click';
import RecentWikiActivityModel from '../models/recent-wiki-activity';

export default Ember.Component.extend(
	TrackClickMixin,
	BottomBannerMixin,
	{
		classNames: ['recent-edit'],
		recentEdit: null,
		recentWikiActivityLink: '/recent-wiki-activity',

		init() {
			this._super(...arguments);
			RecentWikiActivityModel.getRecentActivityList(1, 'user|timestamp|title').then((recentEdit) => {
				this.setProperties({
					loaded: true,
					recentEdit: recentEdit.recentChanges.get('firstObject')
				});

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
		},

		actions: {
			postpone() {
				this.dismissRecentEdit(1, 'postponed');
			},
			dismiss(label) {
				this.dismissRecentEdit(10 * 365, label);
			}
		}
	}
);
