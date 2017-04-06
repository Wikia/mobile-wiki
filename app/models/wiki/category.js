import Ember from 'ember';
import BaseModel from './base';
import fetch from '../../utils/mediawiki-fetch';
import {buildUrl} from '../../utils/url';

const {isEmpty} = Ember,
	CategoryModel = BaseModel.extend({
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
			return fetch(buildUrl({
				host: this.get('host'),
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
		}
	});

CategoryModel.reopenClass({
	/**
	 * @param {Model} model
	 * @param {Object} data
	 * @returns {void}
	 */
	setData(model, {data}) {
		this._super(...arguments);

		if (data && data.nsSpecificContent) {
			model.setProperties(data.nsSpecificContent);
		}
	}
});

export default CategoryModel;
