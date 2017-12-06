import Component from '@ember/component';
import {track, trackActions} from '../utils/track';
import RenderComponentMixin from '../mixins/render-component';

export default Component.extend(RenderComponentMixin, {
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
	didInsertElement() {
		this._super(...arguments);

		const headers = this.get('articleContent').find('h2[section]').map((i, elem) => {
			if (elem.textContent) {
				return {
					element: elem,
					level: elem.tagName,
					name: elem.textContent,
					id: elem.id,
					section: elem.getAttribute('section'),
				};
			}
		}).toArray();

		this.set('headers', headers);
	},

	actions: {
		trackClick(category, label) {
			track({
				action: trackActions.click,
				category,
				label
			});
		}
	}
});
