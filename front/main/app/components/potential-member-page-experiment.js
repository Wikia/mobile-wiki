import Ember from 'ember';
import {getDomain} from '../utils/domain';
import {getGroup} from 'common/modules/abtest';

const dismissDays = 30;

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
	 * Sets dismissed cookie and hides banner
	 * @returns {void}
	 */
	dismiss() {
		Ember.$.cookie(this.dismissCookieName, 1, {expires: dismissDays, path: '/', domain: getDomain()});
		this.set('dismissed', 1);
	},

	actions: {
		learnMore() {
			this.dismiss();
			window.location.assign('http://community.wikia.com/wiki/Tips_on_Getting_Started');
		},

		postpone() {
			this.dismiss();
		},
	}
});
