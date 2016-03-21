import Ember from 'ember';
import {getDomain} from '../utils/domain';

export default Ember.Service.extend({
	currentUser: Ember.inject.service(),
	badges: null,
	init() {
		const badgeCookies = Ember.$.cookie('seenNewBadgeFor');

		let badges = [];

		if (badgeCookies) {
			badges = JSON.parse(badgeCookies);
		}
		this.set('badges', badges);
	},
	shouldDisplay(badge, checkAuthentication = true) {
		if (checkAuthentication && !this.get('currentUser.isAuthenticated')) {
			return false;
		}

		return !this.get('badges').contains(badge) ;
	},
	setBadge(badge, expires = 1, path = '/') {
		this.get('badges').addObject(badge);

		Ember.$.cookie('seenNewBadgeFor', JSON.stringify(this.get('badges')), {
			domain: getDomain(),
			expires,
			path
		});
	}
});
