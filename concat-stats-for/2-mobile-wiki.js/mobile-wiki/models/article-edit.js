define('mobile-wiki/models/article-edit', ['exports', 'mobile-wiki/utils/edit-token', 'mobile-wiki/utils/mediawiki-fetch', 'mobile-wiki/utils/url'], function (exports, _editToken, _mediawikiFetch, _url) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var EmberObject = Ember.Object,
	    computed = Ember.computed,
	    get = Ember.get,
	    inject = Ember.inject;
	exports.default = EmberObject.extend({
		content: null,
		originalContent: null,
		timestamp: null,
		title: null,
		sectionIndex: null,

		wikiVariables: inject.service(),

		isDirty: computed('content', 'originalContent', function () {
			return this.get('content') !== this.get('originalContent');
		}),

		/**
   * @returns {Ember.RSVP.Promise}
   */
		publish: function publish() {
			var _this = this;

			var host = this.get('wikiVariables.host');

			return (0, _editToken.default)(host, this.get('title')).then(function (token) {
				var formData = new FormData();

				formData.append('action', 'edit');
				formData.append('title', _this.get('title'));
				formData.append('section', _this.get('sectionIndex'));
				formData.append('text', _this.get('content'));
				formData.append('token', token);
				formData.append('format', 'json');

				return (0, _mediawikiFetch.default)((0, _url.buildUrl)({ host: host, path: '/api.php' }), {
					method: 'POST',
					body: formData
				}).then(function (response) {
					return response.json();
				}).then(function (response) {
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
		load: function load(title, sectionIndex) {
			var _this2 = this;

			return (0, _mediawikiFetch.default)((0, _url.buildUrl)({
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
			}).then(function (response) {
				return response.json();
			}).then(function (response) {
				var pages = void 0,
				    revision = void 0;

				if (response.error) {
					throw new Error(response.error.code);
				}

				pages = get(response, 'query.pages');

				if (pages) {
					// FIXME: MediaWiki API, seriously?
					revision = pages[Object.keys(pages)[0]].revisions[0];
					_this2.setProperties({
						title: title,
						sectionIndex: sectionIndex,
						content: revision['*'],
						originalContent: revision['*'],
						timestamp: revision.timestamp
					});

					return _this2;
				} else {
					throw new Error();
				}
			});
		}
	});
});