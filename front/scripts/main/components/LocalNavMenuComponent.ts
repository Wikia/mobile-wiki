/// <reference path="../app.ts" />
'use strict';

/**
 * RootNavItem
 * @typedef {Object} RootNavItem
 * @property {NavItem[]} [children]
 */

/**
 * NavItem
 * @typedef {Object} NavItem
 * @implements {RootNavItem}
 * @property {string} href
 * @property {number} index
 * @property {RootNavItem} parent
 * @property {string} text
 */

/**
 * type for topmost-level nav item, which doesn't have any of the
 * properties defined in NavItem. Can also be used to describe any of NavItem
 * which has children
 */
interface RootNavItem {
	// Children, if this item has sub-items
	children?: Array<NavItem>;
}

/**
 * @desc Type for nav menu item
 */
interface NavItem extends RootNavItem {
	// The link to this item's page
	href: string;
	// The index of this item in its parent's children array
	index: number;
	// This item's parent item (could  be RootNavItem or NavItem)
	parent: RootNavItem;
	// Text to print as menu item text
	text: string;
}

App.LocalNavMenuComponent = Em.Component.extend(
	App.TrackClickMixin,
	{
		tagName: 'ul',
		classNames: ['local-nav-menu'],

		menuRoot: Em.computed('model', function (): RootNavItem {
			var menuRoot = {
				//@TODO XW-511 Remove second part of OR statement
				children: Em.get(Mercury, 'wiki.navigation') || Em.get(Mercury, 'wiki.navData.navigation.wiki')
			};

			return this.injectParentPointersAndIndices(menuRoot);
		}),

		currentMenuItem: Em.computed.oneWay('menuRoot'),

		parentItem: Em.computed.alias('currentMenuItem.parent'),

		sideNavVisibleObserver: Em.observer('sideNavVisible', function (): void {
			if (!this.get('sideNavVisible')) {
				this.send('gotoRoot');
			}
		}),

		actions: {
			/**
			 * Action that changes `currentMenuItem` based on the index of `currentMenuItem`'s children
			 *
			 * @param {number} index - The index of the item to change to
			 * @returns {undefined}
			 */
			changeMenuItem(index: number): void {
				var curr: RootNavItem = this.get('currentMenuItem');
				this.set('currentMenuItem', curr.children[index]);

				M.track({
					action: M.trackActions.click,
					category: 'wiki-nav',
					label: 'header-' + (index + 1),
				});
			},

			/**
			 * @returns {undefined}
			 */
			collapseSideNav(): void {
				this.sendAction('collapseSideNav');
			},

			/**
			 * @returns {undefined}
			 */
			gotoRoot(): void {
				this.set('currentMenuItem', this.get('menuRoot'));
			},

			/**
			 * @returns {undefined}
			 */
			goBack(): void {
				this.set('currentMenuItem', this.get('parentItem'));
			},

			/**
			 * @returns {undefined}
			 */
			loadRandomArticle(): void {
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
		injectParentPointersAndIndices(topLevel: RootNavItem): RootNavItem {
			var children: Array<NavItem> = topLevel.children || [],
				i: number,
				len = children.length;

			for (i = 0; i < len; i++) {
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
		 * @returns {undefined}
		 */
		injectParentPointersAndIndicesHelper(parent: RootNavItem, curr: NavItem, index: number): void {
			var i: number,
				len: number;

			curr.parent = parent;
			curr.index = index;

			if (!curr.hasOwnProperty('children')) {
				return;
			}

			for (i = 0, len = curr.children.length; i < len; i++) {
				this.injectParentPointersAndIndicesHelper(curr, curr.children[i], i);
			}
		},
	}
);
