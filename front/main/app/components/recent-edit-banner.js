import Ember from 'ember';
import {getDomain} from '../utils/domain';
import {track, trackActions} from 'common/utils/track';
import RecentWikiActivityModel from '../models/recent-wiki-activity';

export default Ember.Component.extend({
	classNames: ['recent-edit'],
	classNameBindings: ['loaded', 'dismissed'],
	dismissed: false,
	loaded: false,
	recentEdit: null,
	recentWikiActivityLink: '/recent-wiki-activity',
	init() {
		this._super(...arguments);
		RecentWikiActivityModel.getRecentActivityList().then((recentEdit) => {
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
	setCookie(expires) {
		Ember.$.cookie('recent-edit-dismissed', 1, {
			domain: getDomain(),
			expires,
			path: '/'
		});

		this.set('dismissed', true);
	},
	sendTracking(label) {
		track({
			action: trackActions.click,
			category: 'recent-edit-banner',
			label
		});
	},
	actions: {
		postpone(label) {
			this.setCookie(1);
			this.sendTracking(label);
		},
		dismiss(label) {
			this.setCookie(10 * 365);
			this.sendTracking(label);
		}
	}
});
