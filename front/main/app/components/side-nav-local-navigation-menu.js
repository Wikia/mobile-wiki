import Ember from 'ember';
import SideNavNewBadge from '../mixins/side-nav-new-badge';
import TrackClickMixin from '../mixins/track-click';

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
	TrackClickMixin,
	SideNavNewBadge,
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

				this.trackClick('side-nav', `local-nav-menu-show-item-${index + 1}`);
				this.sendAction('updateContent', current.children[index]);
			},

			/**
			 * @returns {void}
			 */
			loadRandomArticle() {
				this.trackClick('side-nav', 'local-nav-open-random-article');
				this.sendAction('loadRandomArticle');
			},

			/**
			 * @returns {void}
			 */
			recentWikiActivityClick() {
				this.hideNewBadge();
				this.get('collapse')();
			},

			clickLink(index) {
				this.trackClick('side-nav', `local-nav-open-link-index-${index + 1}`);
				this.get('collapse')();
			}
		}
	}
);
