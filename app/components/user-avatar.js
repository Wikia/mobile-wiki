import Ember from 'ember';
import {buildUrl} from '../utils/url';

const {Component, computed, inject} = Ember;

export default Component.extend({
	i18n: inject.service(),
	classNames: ['user-avatar'],
	profileName: computed('username', function () {
		const userName = this.get('username') || '';

		return userName.trim();
	}),
	/**
	 * Returns link to the post author's user page
	 * @returns {string}
	 */
	profileUrl: computed('profileName', function () {
		return buildUrl({
			namespace: 'User',
			relative: true,
			title: this.get('profileName'),
		});
	}),
	displayName: computed('profileName', function () {
		return this.get('anonymous') ? this.get('i18n').t('app.username-anonymous') : this.get('profileName');
	}),
	shouldWrapInHref: true
});
