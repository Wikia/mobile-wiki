import Ember from 'ember';
import {getDomain} from '../utils/domain';

export default Ember.Service.extend({
	currentUser: Ember.inject.service(),
	badges: [],
	display: Ember.computed('badges', function(){
		return !this.get('badges').contains('recent-wiki-activity');
	}),
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
		let badges = this.get('badges');

		badges.addObject(badge);
		console.log(badges);
		this.set('badges', badges);
		//this.set('badges', ['recent-wiki-activity']);

		Ember.$.cookie('seenNewBadgeFor', JSON.stringify(['recent-wiki-activity']), {
			domain: getDomain(),
			expires,
			path
		});
	}
});
