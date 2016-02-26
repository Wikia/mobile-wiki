import Ember from 'ember';
import {getDomain} from '../utils/domain';
import TrackClickMixin from './track-click';

export default Ember.Mixin.create({
	TrackClickMixin,
	currentUser: Ember.inject.service(),
	/**
	 * Checks if our currently promoted feature has been viewed on a given device.
	 * @returns {boolean}
	 */
	shouldDisplayNewBadge: Ember.computed('currentUser', function () {
		return this.get('currentUser.isAuthenticated') &&
			Ember.get(Mercury, 'wiki.language.content') === 'en' &&
			Ember.$.cookie('seenNewBadgeFor') !== 'recent-wiki-activity';
	}),

	hideNewBadge() {
		this.trackClick('recent-wiki-activity-blue-dot', 'open-recent-wiki-activity');

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
