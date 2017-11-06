define('mobile-wiki/components/article-table-of-contents', ['exports', 'mobile-wiki/utils/track'], function (exports, _track) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = Ember.Component.extend({
		classNames: ['table-of-contents'],
		layoutName: 'components/article-table-of-contents',

		/**
   * Generates table of contents data based on h2 elements in the article
   * @todo https://wikia-inc.atlassian.net/browse/XW-1425
   * Temporary solution for generating Table of Contents
   * Ideally, we wouldn't be doing this as a post-processing step, but rather we would just get a JSON with
   * ToC data from server and render view based on that.
   *
   * @returns {void}
   */
		didInsertElement: function didInsertElement() {
			var headers = this.get('articleContent').find('h2[section]').map(function (i, elem) {
				if (elem.textContent) {
					return {
						element: elem,
						level: elem.tagName,
						name: elem.textContent,
						id: elem.id,
						section: elem.getAttribute('section')
					};
				}
			}).toArray();

			this.set('headers', headers);
		},


		actions: {
			trackClick: function trackClick(category, label) {
				(0, _track.track)({
					action: _track.trackActions.click,
					category: category,
					label: label
				});
			}
		}
	});
});