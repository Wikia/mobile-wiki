import Ember from 'ember';
import SideNavNewBadge from '../mixins/side-nav-new-badge';
import TrackClickMixin from '../mixins/track-click';
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

				this.sendAction('updateContent', current.children[index]);

				track({
					action: trackActions.click,
					category: 'wiki-nav',
					label: `header-${index + 1}`
				});
			},

			/**
			 * @returns {void}
			 */
			loadRandomArticle() {
				this.trackClick('randomArticle', 'click');
				this.sendAction('loadRandomArticle');
			},

			/**
			 * @returns {void}
			 */
			recentWikiActivityClick() {
				this.hideNewBadge();
				this.get('collapse')();
			},
		}
	}
);
