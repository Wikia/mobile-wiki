import Ember from 'ember';
import {getDomain} from '../utils/domain';

export default Ember.Mixin.create({
	/**
	 * Checks if our currently promoted feature has been viewed on a given device.
	 * @returns {boolean}
     */
	shouldDisplayNewBadge: Ember.computed('promotedFeature', () => {
		return Ember.get(Mercury, 'wiki.language.content') === 'en' &&
			$.cookie('seenNewBadgeFor') !== 'recent-wiki-activity';
	}),

	actions: {
		hideNewBadge() {
			$.cookie('seenNewBadgeFor', 'recent-wiki-activity', {
				domain: getDomain(),
				expires: 10 * 365,
				path: '/'
			});
		}
	}
});
