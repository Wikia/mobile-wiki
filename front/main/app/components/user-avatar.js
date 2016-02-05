import Ember from 'ember';

export default Ember.Component.extend({
	classNames: ['user-avatar'],
	profileName: Ember.computed('username', function () {
		const userName = this.get('username') || '';

		return userName.trim();
	}),

	/**
	 * Returns link to the post author's user page
	 * @returns {string}
	 */
	profileUrl: Ember.computed('profileName', function () {
		return M.buildUrl({
			namespace: 'User',
			title: this.get('profileName'),
		});
	}),
	shouldWrapInHref: Ember.computed('anonymous', function () {
		return this.get('anonymous') !== true;
	})
});
