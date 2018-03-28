import {inject as service} from '@ember/service';
import Component from '@ember/component';
import {computed} from '@ember/object';
import toArray from '../utils/toArray';

/**
 * @typedef {Object} ArticleCommentThumbnailData
 * @property {string} name
 * @property {string} full
 * @property {string} [capt]
 * @property {string} [type]
 */

export default Component.extend({
	i18n: service(),
	wikiVariables: service(),
	tagName: 'li',
	classNames: ['article-comment'],

	isExpanded: false,
	users: null,
	comment: null,
	thumbnailWidth: 480,

	user: computed('users', function () {
		const users = this.get('users');

		if (users) {
			return users[this.get('comment.userName')] || {};
		}
	}),

	userName: computed('comment.userName', function () {
		// Checks for an IP address to identify an anonymous user. This is very crude and obviously doesn't check IPv6.
		const userName = this.get('comment.userName'),
			regex = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/;

		if (regex.test(userName)) {
			return this.get('i18n').t('app.username-anonymous');
		} else {
			return userName;
		}
	}),

	didInsertElement() {
		toArray(this.element.querySelectorAll('figure img')).forEach((element) => {
			element.setAttribute('src', element.getAttribute('data-src'));
		});
	},

	actions: {
		toggleExpand() {
			this.toggleProperty('isExpanded');
		},
	}
});
