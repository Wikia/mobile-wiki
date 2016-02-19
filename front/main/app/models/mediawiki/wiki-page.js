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
			let model;

			if (isContentNamespace()) {
				model = ArticleModel.create(params);
				debugger;

				if (M.prop('articleContentPreloadedInDOM') && !M.prop('asyncArticle')) {
					ArticleModel.setArticle(model);
					resolve(model);
					return;
				}
			}

			Ember.$.ajax({
				url: this.url(params),
				dataType: 'json',
				success: (data) => {
					if (isContentNamespace()) {
						model = ArticleModel.create(params);
						ArticleModel.setArticle(model, data);
						return resolve(model);
					}
					resolve(WikiPageModel.create(data));
				},
				error: (err) => {
					// Temporary solution until we can make error states work - ideally we should reject on errors
					if (err.status === 404 && isContentNamespace()) {
						model = ArticleModel.create(params);
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
