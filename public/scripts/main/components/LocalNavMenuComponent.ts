/// <reference path="../app.ts" />
'use strict';

/**
 * @desc type for topmost-level nav item, which doesn't have any of the
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

App.LocalNavMenuComponent = Em.Component.extend({
	tagName: 'ul',
	classNames: ['local-nav-menu'],

	/**
	 * Note: this means that the model is stored directly
	 * in the Wikia object. We may wish to actually copy it over,
	 * or removed the reference in the Wikia object to it so that
	 * this component has exclusive access to it.
	 */
	model: function (): any {
		return Mercury.wiki.navData;
	}.property(),

	menuRoot: function (): RootNavItem {
		return {
			children: this.get('model.navigation.wiki')
		};
	}.property('model'),

	currentMenuItem: Em.computed.oneWay('menuRoot'),

	parentItem: Em.computed.alias('currentMenuItem.parent'),

	actions: {
		/**
		 * @desc Action that changes `currentMenuItem` based on the index of
		 * `currentMenuItem`'s children
		 * @param index The index of the item to change to
		 */
		changeMenuItem: function (index: number): void {
			var curr: RootNavItem = this.get('currentMenuItem');
			this.set('currentMenuItem', curr.children[index]);

			M.track({
				action: M.trackActions.click,
				category: 'wiki-nav',
				label: 'header-' + (index + 1)
			});
		},

		collapseSideNav: function (): void {
			this.set('sideNavCollapsed', true);
		},

		gotoRoot: function (): void {
			this.set('currentMenuItem', this.get('menuRoot'));
		},

		goBack: function (): void {
			this.set('currentMenuItem', this.get('parentItem'));
		}
	},

	sideNavCollapsedObserver: function () {
		if (this.get('sideNavCollapsed')) {
			this.send('gotoRoot');
		}
	}.observes('sideNavCollapsed'),

	willInsertElement: function (): void {
		this.injectParentPointersAndIndices();
	},

	/**
	 * @desc function which recursively sets the 'parent' property
	 * of all of the items in the navData tree. It also sets the index
	 * of each item in its parent's `children` array, necessary because
	 * of how finicky Ember slightly customized version of Handlebars is.
	 *
	 * We need this because JSON can store child nav objects,
	 * but cannot store references to parent objects.
	 */
	injectParentPointersAndIndices: function (): void {
		// topLevel is almost a NavItem but it has no href or text
		var topLevel: RootNavItem = this.get('menuRoot'),
			children: Array<NavItem> = topLevel.children || [],
			i: number,
			len = children.length;
		for (i = 0; i < len; i++) {
			this.injectParentPointersAndIndicesHelper(topLevel, children[i], i);
		}
	},

	/**
	 * Recursive helper for the `injectParentPointersAndIndices` function.
	 * @param parent The parent of curr
	 * @param curr The object to set the parent of, and then recursively
	 * set the parent of all its children, depth-first
	 * @param index The index of this item in its parent's children array, because
	 * we need it to link to the correct child
	 */
	injectParentPointersAndIndicesHelper: function (parent: RootNavItem, curr: NavItem, index: number): void {
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
	}
});
