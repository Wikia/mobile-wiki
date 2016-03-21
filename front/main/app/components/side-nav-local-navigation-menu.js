import Ember from 'ember';
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
	{
		tagName: 'ul',
		classNames: ['local-nav-menu'],
		newBadges: Ember.inject.service(),
		shouldDisplayNewBadge: Ember.computed('newBadges', function () {
			return !this.get('newBadges.badges').contains('recent-wiki-activity');
		}),

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
				this.trackClick('side-nav', 'local-nav-open-random-article');
				this.sendAction('loadRandomArticle');
			},

			/**
			 * @returns {void}
			 */
			recentWikiActivityClick() {
				this.trackClick('recent-wiki-activity-blue-dot', 'open-recent-wiki-activity');
				this.get('newBadges').setBadge('recent-wiki-activity', 10 * 365);
				this.get('collapse')();
			},

			clickLink(index) {
				this.trackClick('side-nav', `local-nav-open-link-index-${index + 1}`);
				this.get('collapse')();
			}
		}
	}
);
