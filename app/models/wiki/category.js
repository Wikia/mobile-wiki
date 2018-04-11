import {isEmpty} from '@ember/utils';
import {inject as service} from '@ember/service';
import BaseModel from './base';
import fetch from '../../utils/mediawiki-fetch';
import {buildUrl} from '../../utils/url';
import getLanguageCodeFromRequest from '../utils/language';

export default BaseModel.extend({
	fastboot: service(),

	host: null,
	hasArticle: false,
	membersGrouped: null,
	nextPage: null,
	pages: null,
	prevPage: null,
	trendingArticles: null,


	/**
	 * @param {number} page
	 * @returns {Ember.RSVP.Promise}
	 */
	loadPage(page) {
		const langPath = getLanguageCodeFromRequest(this.get('fastboot.request'));

		return fetch(buildUrl({
			host: this.get('host'),
			langPath,
			path: '/wikia.php',
			query: {
				controller: 'MercuryApi',
				method: 'getCategoryMembers',
				title: this.get('title'),
				categoryMembersPage: page,
				format: 'json'
			}
		}))
			.then((response) => response.json())
			.then(({data}) => {
				if (isEmpty(data) || isEmpty(data.membersGrouped)) {
					throw new Error('Unexpected response from server');
				}

				this.setProperties(data);
			});
	},

	/**
	 * @param {Object} data
	 * @returns {void}
	 */
	setData({data}) {
		this._super(...arguments);

		if (data && data.nsSpecificContent) {
			this.setProperties(data.nsSpecificContent);
		}
	}
});
