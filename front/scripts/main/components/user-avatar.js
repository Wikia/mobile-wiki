export default Ember.Component.extend({
	classNames: ['user-avatar'],
	profileName: Ember.computed('username', function () {
		return this.get('username') ? this.get('username').trim() : '';
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
	wrapInHref: Ember.computed('wrapAvatar', function () {
		console.log('Avatar wrapping', this.get('wrapAvatar'));
		console.log('Is undefined?',typeof this.get('wrapAvatar') === 'undefined');
		return (typeof this.get('wrapAvatar') === 'undefined');
	})
});
