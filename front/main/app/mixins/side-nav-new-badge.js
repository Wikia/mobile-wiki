import Ember from 'ember';
import {getDomain} from '../utils/domain';
import TrackClickMixin from './track-click';

export default Ember.Mixin.create({
	TrackClickMixin,
	currentUser: Ember.inject.service(),
	newBadges: {
		shouldDisplay: false
	},

	/**
	 * Checks if our currently promoted feature has been viewed on a given device.
	 *
	 * @returns {boolean}
	 */
	shouldDisplayNewBadge: Ember.computed('currentUser', function () {
		const shouldDisplay = this.get('currentUser.isAuthenticated') &&
			Ember.$.cookie('seenNewBadgeFor') !== 'recent-wiki-activity';

		this.set('newBadges.shouldDisplay', shouldDisplay);

		return shouldDisplay;
	}),

	/**
	 * Hides badge.
	 *
	 * We need that because it's called in side-nav-local-navigation-menu.js
	 * after clicking menu item (method recentWikiActivityClick)
	 *
	 * @returns {void}
	 */
	hideNewBadge() {
		this.trackClick('recent-wiki-activity-blue-dot', 'open-recent-wiki-activity');
		this.set('newBadges.shouldDisplay', false);

		Ember.$.cookie('seenNewBadgeFor', 'recent-wiki-activity', {
			domain: getDomain(),
			expires: 10 * 365,
			path: '/'
		});
	},

	actions: {
		hideNewBadge() {
			this.hideNewBadge();
		}
	}
});
