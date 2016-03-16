import Ember from 'ember';
import {getDomain} from '../utils/domain';
import {track, trackActions} from 'common/utils/track';
import TrackClickMixin from '../mixins/track-click';
import RecentWikiActivityModel from '../models/recent-wiki-activity';

export default Ember.Component.extend(
	TrackClickMixin,
	{
		classNames: ['recent-edit'],
		classNameBindings: ['loaded', 'dismissed'],
		dismissed: false,
		loaded: false,
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

		setCookie(expires) {
			Ember.$.cookie('recent-edit-dismissed', 1, {
				domain: getDomain(),
				expires,
				path: '/'
			});
		},

		sendTracking(label) {
			this.trackClick('recent-edit-banner', label);
		},

		dismissRecentEdit(expires, label) {
			this.setCookie(expires);
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
