import {inject as service} from '@ember/service';
import EmberObject, {get, computed} from '@ember/object';
import getEditToken from '../utils/edit-token';
import fetch from '../utils/mediawiki-fetch';
import {buildUrl} from '../utils/url';
import getLanguageCodeFromRequest from '../utils/language';

export default EmberObject.extend({
	content: null,
	originalContent: null,
	timestamp: null,
	title: null,
	sectionIndex: null,

	wikiVariables: service(),
	fastboot: service(),

	isDirty: computed('content', 'originalContent', function () {
		return this.get('content') !== this.get('originalContent');
	}),

	langPath: computed('fastboot', function () {
		return getLanguageCodeFromRequest(this.get('fastboot.request'));
	}),

	/**
	 * @returns {Ember.RSVP.Promise}
	 */
	publish() {
		const host = this.get('wikiVariables.host'),
			langPath = this.get('langPath');

		return getEditToken(host, this.get('title'), langPath)
			.then((token) => {
				const formData = new FormData();

				formData.append('action', 'edit');
				formData.append('title', this.get('title'));
				formData.append('section', this.get('sectionIndex'));
				formData.append('text', this.get('content'));
				formData.append('token', token);
				formData.append('format', 'json');

				return fetch(buildUrl({host, langPath, path: '/api.php'}), {
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
		return fetch(buildUrl({
			host: this.get('wikiVariables.host'),
			langPath: this.get('langPath'),
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
