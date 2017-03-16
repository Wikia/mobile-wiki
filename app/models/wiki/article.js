import Ember from 'ember';
import BaseModel from './base';
import request from 'ember-ajax/request';
import {buildUrl} from '../../utils/url';

const ArticleModel = BaseModel.extend({
	content: null,
	comments: 0,
	isCuratedMainPage: false,
	isMainPage: false,
	curatedMainPageData: null,
	user: null
});

ArticleModel.reopenClass({
	/**
	 * @returns {Ember.RSVP.Promise}
	 */
	getArticleRandomTitle() {
		return request(buildUrl({
			path: '/api.php',
			query: {
				action: 'query',
				generator: 'random',
				grnnamespace: 0,
				format: 'json'
			}
		}), {
			cache: false,
		}).then((data) => {
			if (data.query && data.query.pages) {
				const articleId = Object.keys(data.query.pages)[0],
					pageData = data.query.pages[articleId];

				if (pageData.title) {
					return pageData.title;
				}
			}

			throw new Error({
				message: 'Data from server misshaped',
				data
			});
		});
	},

	/**
	 * @param {Model} model
	 * @param {Object} exception
	 * @param {Object} data
	 * @returns {void}
	 */
	setData(model, {exception, data}) {
		this._super(...arguments);

		let articleProperties = {},
			details;

		if (!exception && data) {
			if (data.details) {
				details = data.details;

				articleProperties = {
					comments: details.comments,
					user: details.revision.user_id
				};
			}

			if (data.article) {
				articleProperties.content = data.article.content;
			}

			if (data.relatedPages) {
				/**
				 * Code to combat a bug observed on the Karen Traviss page on the Star Wars wiki, where there
				 * are no relatedPages for some reason. Moving forward it would be good for the Wikia API
				 * to handle this and never return malformed structures.
				 */
				articleProperties.relatedPages = data.relatedPages;
			}

			if (data.topContributors) {
				// Same issue: the response to the ajax should always be valid and not undefined
				articleProperties.topContributors = data.topContributors;
			}

			articleProperties.isMainPage = data.isMainPage || false;

			if (data.curatedMainPageData) {
				articleProperties.curatedMainPageData = data.curatedMainPageData;
				articleProperties.isCuratedMainPage = true;
			}
		}

		model.setProperties(articleProperties);
	}
});

export default ArticleModel;
