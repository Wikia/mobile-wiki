import Ember from 'ember';
import TrackClickMixin from '../mixins/track-click';
import {track, trackActions} from '../../mercury/utils/track';

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

		menuRoot: Ember.computed('model', function () {
			const menuRoot = {
				// @TODO XW-511 Remove second part of OR statement
				children: Ember.get(Mercury, 'wiki.navigation') || Ember.get(Mercury, 'wiki.navData.navigation.wiki')
			};

			return this.injectParentPointersAndIndices(menuRoot);
		}),

		currentMenuItem: Ember.computed.oneWay('menuRoot'),

		parentItem: Ember.computed.alias('currentMenuItem.parent'),

		sideNavVisibleObserver: Ember.observer('sideNavVisible', function () {
			if (!this.get('sideNavVisible')) {
				this.send('gotoRoot');
			}
		}),

		actions: {
			/**
			 * Action that changes `currentMenuItem` based on the index of `currentMenuItem`'s children
			 *
			 * @param {number} index - The index of the item to change to
			 * @returns {void}
			 */
			changeMenuItem(index) {
				const curr = this.get('currentMenuItem');

				this.set('currentMenuItem', curr.children[index]);

				track({
					action: trackActions.click,
					category: 'wiki-nav',
					label: `header-${(index + 1)}`,
				});
			},

			/**
			 * @returns {void}
			 */
			collapseSideNav() {
				this.sendAction('collapseSideNav');
			},

			/**
			 * @returns {void}
			 */
			gotoRoot() {
				this.set('currentMenuItem', this.get('menuRoot'));
			},

			/**
			 * @returns {void}
			 */
			goBack() {
				this.set('currentMenuItem', this.get('parentItem'));
			},

			/**
			 * @returns {void}
			 */
			loadRandomArticle() {
				this.trackClick('randomArticle', 'click');
				this.sendAction('loadRandomArticle');
			},
		},

		/**
		 * function which recursively sets the 'parent' property
		 * of all of the items in the navData tree. It also sets the index
		 * of each item in its parent's `children` array, necessary because
		 * of how finicky Ember slightly customized version of Handlebars is.
		 *
		 * We need this because JSON can store child nav objects,
		 * but cannot store references to parent objects.
		 *
		 * @param {RootNavItem} topLevel
		 * @returns {RootNavItem}
		 */
		injectParentPointersAndIndices(topLevel) {
			const children = topLevel.children || [],
				len = children.length;

			for (let i = 0; i < len; i++) {
				this.injectParentPointersAndIndicesHelper(topLevel, children[i], i);
			}

			return topLevel;
		},

		/**
		 * Recursive helper for the `injectParentPointersAndIndices` function.
		 *
		 * @param {RootNavItem} parent - The parent of curr
		 * @param {NavItem} curr - The object to set the parent of, and then recursively
		 * set the parent of all its children, depth-first
		 * @param {number} index - The index of this item in its parent's children array, because
		 * we need it to link to the correct child
		 * @returns {void}
		 */
		injectParentPointersAndIndicesHelper(parent, curr, index) {
			curr.parent = parent;
			curr.index = index;

			if (!curr.hasOwnProperty('children')) {
				return;
			}

			for (let i = 0, len = curr.children.length; i < len; i++) {
				this.injectParentPointersAndIndicesHelper(curr, curr.children[i], i);
			}
		},
	}
);
