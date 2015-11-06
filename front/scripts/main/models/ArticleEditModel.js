App.ArticleEditModel = Em.Object.extend({
	content: null,
	originalContent: null,
	timestamp: null,
	title: null,
	sectionIndex: null,
	isDirty: Em.computed('content', 'originalContent', function () {
		return this.get('content') !== this.get('originalContent');
	})
});

App.ArticleEditModel.reopenClass(App.ArticleEditMixin, {
	/**
	 * @param {*} model
	 * @returns {Em.RSVP.Promise}
	 */
	publish(model) {
		return new Em.RSVP.Promise((resolve, reject) => {
			this.getEditToken(model.title)
				.then((token) => {
					Em.$.ajax({
						url: M.buildUrl({path: '/api.php'}),
						data: {
							action: 'edit',
							title: model.title,
							section: model.sectionIndex,
							text: model.content,
							token,
							format: 'json'
						},
						dataType: 'json',
						method: 'POST',
						success: (resp) => {
							if (resp && resp.edit && resp.edit.result === 'Success') {
								resolve();
							} else if (resp && resp.error) {
								reject(resp.error.code);
							} else {
								reject();
							}
						},
						error: (err) => reject(err)
					});
				}, (err) => reject(err));
		});
	},

	/**
	 * @param {string} title
	 * @param {number} sectionIndex
	 * @returns {Em.RSVP.Promise}
	 */
	load(title, sectionIndex) {
		return new Em.RSVP.Promise((resolve, reject) => {
			Em.$.ajax({
				url: M.buildUrl({path: '/api.php'}),
				dataType: 'json',
				cache: false,
				data: {
					action: 'query',
					prop: 'revisions',
					// FIXME: It should be possible to pass props as an array
					rvprop: 'content|timestamp',
					titles: title,
					rvsection: sectionIndex,
					format: 'json'
				}
			}).done((resp) => {
				let pages,
					revision;

				if (resp.error) {
					reject(resp.error.code);
					return;
				}

				pages = Em.get(resp, 'query.pages');

				if (pages) {
					// FIXME: MediaWiki API, seriously?
					revision = pages[Object.keys(pages)[0]].revisions[0];
					resolve(App.ArticleEditModel.create({
						title,
						sectionIndex,
						content: revision['*'],
						originalContent: revision['*'],
						timestamp: revision.timestamp
					}));
				} else {
					reject();
				}
			}).fail((err) => reject(err));
		});
	}
});
