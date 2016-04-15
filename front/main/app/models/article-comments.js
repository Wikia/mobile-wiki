import Ember from 'ember';

export default Ember.Object.extend({
	articleId: null,
	comments: 0,
	users: null,
	pagesCount: 0,
	page: 0,

	fetch: Ember.observer('page', 'articleId', function () {
		const page = this.get('page'),
			articleId = this.get('articleId');

		if (page && page >= 0 && articleId) {
			return new Ember.RSVP.Promise((resolve, reject) => {
				Ember.$.ajax({
					url: this.url(articleId, page),
					success: (data) => {
						this.setProperties(data.payload);
						resolve(this);
					},
					error: (data) => reject(data)
				});
			});
		}
	}),

	reset: Ember.observer('articleId', function () {
		this.setProperties({
			comments: 0,
			users: null,
			pagesCount: 0
		});
	}),

	/**
	 * @param {number} articleId
	 * @param {number} [page=0]
	 * @returns {string}
	 */
	url(articleId, page = 0) {
		return M.buildUrl({
			path: '/wikia.php',
			query: {
				controller: 'MercuryApi',
				method: 'getArticleComments',
				id: articleId,
				page
			}
		});
	}
});
