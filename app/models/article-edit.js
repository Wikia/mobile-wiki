import { inject as service } from '@ember/service';
import EmberObject, { get, computed } from '@ember/object';
import { getOwner } from '@ember/application';
import EditTokenModel from './edit-token';
import fetch from '../utils/mediawiki-fetch';

export default EmberObject.extend({
	content: null,
	originalContent: null,
	timestamp: null,
	title: null,
	sectionIndex: null,

	wikiVariables: service(),
	wikiUrls: service(),

	isDirty: computed('content', 'originalContent', function () {
		return this.content !== this.originalContent;
	}),

	/**
	 * @returns {Ember.RSVP.Promise}
	 */
	publish() {
		const host = this.get('wikiVariables.host');

		return EditTokenModel.create(getOwner(this).ownerInjection()).fetch(host, this.title)
			.then((token) => {
				const formData = new FormData();

				formData.append('action', 'edit');
				formData.append('title', this.title);
				formData.append('section', this.sectionIndex);
				formData.append('text', this.content);
				formData.append('token', token);
				formData.append('format', 'json');

				return fetch(this.wikiUrls.build({ host, path: '/api.php' }), {
					method: 'POST',
					body: formData,
				})
					.then((response) => response.json())
					.then((response) => {
						if (response && response.edit && response.edit.result === 'Success') {
							return response.edit.result;
						} else if (response && response.error) {
							throw new Error(response.error.code);
						} else {
							throw new Error();
						}
					});
			});
	},

	/**
	 * @param {string} title
	 * @param {number} sectionIndex
	 * @returns {Ember.RSVP.Promise}
	 */
	load(title, sectionIndex) {
		return fetch(this.wikiUrls.build({
			host: this.get('wikiVariables.host'),
			path: '/api.php',
			query: {
				action: 'query',
				prop: 'revisions',
				// FIXME: It should be possible to pass props as an array
				rvprop: 'content|timestamp',
				titles: title,
				rvsection: sectionIndex,
				format: 'json',
				cb: new Date().getTime()
			}
		}), {
			cache: 'no-store'
		}).then((response) => response.json())
			.then((response) => {
				let pages,
					revision;

				if (response.error) {
					throw new Error(response.error.code);
				}

				pages = get(response, 'query.pages');

				if (pages) {
					// FIXME: MediaWiki API, seriously?
					revision = pages[Object.keys(pages)[0]].revisions[0];
					this.setProperties({
						title,
						sectionIndex,
						content: revision['*'],
						originalContent: revision['*'],
						timestamp: revision.timestamp
					});

					return this;
				} else {
					throw new Error();
				}
			});
	}
});
