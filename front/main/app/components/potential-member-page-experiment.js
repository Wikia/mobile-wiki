import Ember from 'ember';
import {getDomain} from '../utils/domain';
import {getGroup} from 'common/modules/abtest';

export default Ember.Component.extend({
	currentUser: Ember.inject.service(),
	dismissed: Ember.computed('dismissCookieName', function () {
		return Ember.$.cookie(this.get('dismissCookieName'));
	}),
	dismissCookieName: 'potential-member-experiment-dismiss',
	experimentEnabled: Ember.computed('currentUser.userId', 'experimentGroup', 'dismissed', function () {
		const contentLanguage = Ember.get(Mercury, 'wiki.language.content'),
			userId = this.get('currentUser.userId');

		return this.get('experimentGroup') === getGroup('POTENTIAL_MEMBER_PAGE_ENTRY_POINTS') &&
			!this.get('dismissed') &&
			contentLanguage === 'en' &&
			userId;
	}),
	layoutName: 'components/potential-member-page-experiment',

	/**
	 * Sets dismissed cookie for provided number for days and hides banner
	 * @param {number} days
	 * @returns {void}
	 */
	dismiss(days) {
		Ember.$.cookie(this.dismissCookieName, 1, {expires: days, path: '/', domain: getDomain()});
		this.set('dismissed', 1);
	},

	actions: {
		learnMore() {
			this.dismiss(30);
			window.location.assign('http://community.wikia.com/wiki/Tips_on_Getting_Started');
		},

		postpone() {
			this.dismiss(1);
		},
	}
});
