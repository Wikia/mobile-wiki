import Ember from 'ember';
import TrackClickMixin from './track-click';

export default Ember.Mixin.create({
	TrackClickMixin,
	currentUser: Ember.inject.service(),
	newBadges: Ember.inject.service(),

	/**
	 * Checks if our currently promoted feature has been viewed on a given device.
	 *
	 * @returns {boolean}
	 */
	shouldDisplayNewBadge: Ember.computed('currentUser', 'newBadges', function () {
		console.log(this);
		return this.get('currentUser.isAuthenticated') &&
			!this.get('newBadges').getState('recent-wiki-activity');
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
		this.get('newBadges').setState('recent-wiki-activity');
	},

	actions: {
		hideNewBadge() {
			this.hideNewBadge();
		}
	}
});
