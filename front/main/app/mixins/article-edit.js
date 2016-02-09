import Ember from 'ember';

export default Ember.Mixin.create({
	/**
	 * @param {string} title
	 * @returns {Ember.RSVP.Promise}
	 */
	getEditToken(title) {
		return new Ember.RSVP.Promise((resolve, reject) => {
			Ember.$.ajax({
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
					const pages = Ember.get(resp, 'query.pages');

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
				error: (err) => reject(err)
			});
		});
	}
});
