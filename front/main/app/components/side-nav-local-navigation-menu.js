import Ember from 'ember';
import {track, trackActions} from 'common/utils/track';

/**
 * Type for topmost-level nav item, which doesn't have any of the properties defined in NavItem
 * Can also be used to describe any of NavItem which has children
 *
 * @typedef {Object} RootNavItem
 * @property {NavItem[]} [children]
 */

/**
 * Type for nav menu item
 *
 * @typedef {Object} NavItem
 * @property {string} href
 * @property {number} index
 * @property {RootNavItem} parent
 * @property {string} text
 * @property {NavItem[]} [children]
 */

export default Ember.Component.extend(
	{
		tagName: 'ul',
		classNames: ['local-nav-menu'],

		actions: {
			/**
			 * Action that changes `currentMenuItem` based on the index of `currentMenuItem`'s children
			 *
			 * @param {number} index - The index of the item to change to
			 * @returns {void}
			 */
			changeMenuItem(index) {
				const current = this.get('localNavContent');

				this.sendAction('updateContent', current.children[index]);
			},

			/**
			 * @returns {void}
			 */
			loadRandomArticle() {
				track({
					action: trackActions.click,
					category: 'side-nav',
					label: 'local-nav-open-random-article'
				});
				this.sendAction('loadRandomArticle');
			},

			/**
			 * @returns {void}
			 */
			recentWikiActivityClick() {
				track({
					action: trackActions.click,
					category: 'recent-wiki-activity',
					label: 'open-recent-wiki-activity'
				});
				this.get('collapse')();
			},

			clickLink(index) {
				track({
					action: trackActions.click,
					category: 'side-nav',
					label: `local-nav-open-link-index-${index + 1}`
				});
				this.get('collapse')();
			}
		}
	}
);
