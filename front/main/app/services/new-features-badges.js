import Ember from 'ember';
import {getDomain} from '../utils/domain';

export default Ember.Service.extend({
	currentUser: Ember.inject.service(),
	features: null,
	init() {
		const badgesCookie = Ember.$.cookie('seenNewBadgeFor');

		let features = [];

		if (badgesCookie) {
			features = JSON.parse(badgesCookie);
		}
		this.set('features', features);
	},
	/**
	 * Checks if current user was already informed about new feature (based on data in cookie)
	 *
	 * @param {string} featureName
	 * @param {boolean} checkAuthentication
	 * @returns {boolean}
	 */
	shouldDisplay(featureName, checkAuthentication = true) {
		if (checkAuthentication && !this.get('currentUser.isAuthenticated')) {
			return false;
		}

		return !this.get('features').contains(featureName);
	},
	/**
	 * Store information that user has seen information about new feature
	 *
	 * @param {string} featureName
	 * @param {int} expires (default 10 years - 10 * 365)
	 * @param {string} path
	 * @returns {void}
	 */
	addFeature(featureName, expires = 3650, path = '/') {
		const features = this.get('features');

		features.addObject(featureName);

		Ember.$.cookie('seenNewBadgeFor', JSON.stringify(features), {
			domain: getDomain(),
			expires,
			path
		});
	}
});
