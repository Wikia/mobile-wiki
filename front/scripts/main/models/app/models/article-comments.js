App.ArticleCommentsModel = Em.Object.extend({
	articleId: null,
	comments: 0,
	users: null,
	pagesCount: 0,
	page: 0,

	fetch: Em.observer('page', 'articleId', function () {
		const page = this.get('page'),
			articleId = this.get('articleId');

		if (page && page >= 0 && articleId) {
			return new Em.RSVP.Promise((resolve, reject) => {
				Em.$.ajax({
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

	reset: Em.observer('articleId', function () {
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
		return `${App.get('apiBase')}/article/comments/${articleId}/${page}`;
	}
});
