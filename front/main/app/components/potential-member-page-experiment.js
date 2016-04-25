import Ember from 'ember';
import {track, trackActions} from 'common/utils/track';

export default Ember.Component.extend({
	classNames: ['potential-member-page-experiment'],
	currentUser: Ember.inject.service(),

	experimentEnabled: Ember.computed('currentUser', function () {
		const contentLanguage = Ember.get(Mercury, 'wiki.language.content'),
			userId = this.get('currentUser').get('userId');

		return contentLanguage === 'en' && userId;
	}),
	trackClick(label) {
		track({
			action: trackActions.click,
			category: this.trackingCategory,
			label
		});
	},
	trackingCategory: 'potential-member-experiment',

	actions: {
		learnMore() {
			this.trackClick('entry-point');
			window.location.assign('http://community.wikia.com/wiki/Tips_on_Getting_Started');
		}
	}
});
