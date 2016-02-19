import {isContentNamespace} from '../../utils/mediawiki-namespace';
import ArticleModel from './article';

const WikiPageModel = Ember.Object.extend({
	data: null
});

WikiPageModel.reopenClass({
	/**
	 * @param {ArticleModelUrlParams} params
	 * @returns {string}
	 */
	url(params) {
		let redirect = '';

		if (params.redirect) {
			redirect += `?redirect=${encodeURIComponent(params.redirect)}`;
		}

		return `${M.prop('apiBase')}/article/${params.title}${redirect}`;
	},

	/**
	 * @param {ArticleModelFindParams} params
	 * @returns {Ember.RSVP.Promise}
	 */
	find(params) {
		return new Ember.RSVP.Promise((resolve, reject) => {
			if (isContentNamespace()) {
				if (M.prop('articleContentPreloadedInDOM') && !M.prop('asyncArticle')) {
					const model = ArticleModel.create(params);

					ArticleModel.setArticle(model);
					resolve(model);
					return;
				}
			}

			Ember.$.ajax({
				url: this.url(params),
				dataType: 'json',
				success: (data) => {
					// @todo - https://wikia-inc.atlassian.net/browse/XW-1151 (this should be handled differently)
					M.prop('mediaWikiNamespace', data.ns);

					if (isContentNamespace()) {
						const model = ArticleModel.create(params);

						ArticleModel.setArticle(model, data);
						return resolve(model);
					}
					resolve(WikiPageModel.create(data));
				},
				error: (err) => {
					/**
					 * Temporary solution until we can make error states work
					 * ideally we should reject on errors
					 *
					 * On error always show article (for now)
					 */
					if (err.status === 404) {
						const model = ArticleModel.create(params);

						ArticleModel.setArticle(model, err.responseJSON);
						resolve(model);
					} else {
						reject(err);
					}
				}
			});
		});
	}
});

export default WikiPageModel;
