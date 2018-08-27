import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { computed } from '@ember/object';
import toArray from '../utils/toArray';
import { isIpAddress } from '../utils/string';

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
		const users = this.users;

		if (users) {
			return users[this.get('comment.userName')] || {};
		}

		return undefined;
	}),

	userName: computed('comment.userName', function () {
		const userName = this.get('comment.userName');

		if (isIpAddress(userName)) {
			return this.i18n.t('app.username-anonymous');
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
	},
});
