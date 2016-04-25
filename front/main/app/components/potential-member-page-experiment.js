import Ember from 'ember';

export default Ember.Component.extend({
	classNames: ['potential-member-page-experiment'],
	currentUser: Ember.inject.service(),

	experimentEnabled: Ember.computed('currentUser', function () {
		const contentLanguage = Ember.get(Mercury, 'wiki.language.content'),
			userId = this.get('currentUser').get('userId');

		return contentLanguage === 'en' && userId;
	})
});
