import Ember from 'ember';
import {addQueryParams} from '../../utils/url';

const {Component, computed} = Ember;

export default Component.extend({
	tagName: '',
	linkClasses: computed('model.title.key', function () {
		const classMap = {
			'global-navigation-anon-sign-in': 'wds-button wds-is-full-width',
			'global-navigation-anon-register': 'wds-button wds-is-full-width wds-is-secondary',
			'global-navigation-user-sign-out': 'wds-global-navigation__dropdown-link'
		};

		return classMap[this.get('model.title.key')] || '';
	}),
	href: computed.alias('model.href')
});
