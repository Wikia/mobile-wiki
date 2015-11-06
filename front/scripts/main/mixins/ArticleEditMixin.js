App.ArticleEditMixin = Em.Mixin.create({

	/**
	 * @param {string} title
	 * @returns {Em.RSVP.Promise}
	 */
	getEditToken(title) {
		return new Em.RSVP.Promise((resolve, reject) => {
			Em.$.ajax({
				url: M.buildUrl({path: '/api.php'}),
				data: {
					action: 'query',
					prop: 'info',
					titles: title,
					intoken: 'edit',
					format: 'json'
				},
				dataType: 'json',
				success: (resp) => {
					const pages = Em.get(resp, 'query.pages');

					if (pages) {
						// FIXME: MediaWiki API, seriously?
						const edittoken = pages[Object.keys(pages)[0]].edittoken;

						if (typeof edittoken === 'undefined') {
							reject('noedit');
						}

						resolve(edittoken);
					} else {
						reject();
					}
				},
				error: (err) => {
					reject(err);
				}
			});
		});
	}
});
