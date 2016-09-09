import Ember from 'ember';

export default Ember.Component.extend({
	tagName: '',
	linkClasses: Ember.computed('model.title.key', function () {
		const messageKey = this.get('model.title.key');

		if (messageKey === 'global-navigation-anon-sign-in') {
			return 'wds-button wds-is-full-width';
		} else if (messageKey === 'global-navigation-anon-register') {
			return 'wds-button wds-is-full-width wds-is-secondary';
		} else if (messageKey === 'global-navigation-user-sign-out') {
			return 'wds-global-navigation__dropdown-link';
		}

		return '';
	})
});
