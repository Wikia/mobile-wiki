/// <reference path="../app.ts" />
'use strict';

/**
 * @desc Type for nav menu item
 * The top level only has a children array, and the leaf nodes don't have
 * children arrays, so all properties have to be optional
 */
interface NavItem {
	// Children, if this item has sub-items
	children?: Array<NavItem>;
	// The link to this item's page
	href?: string;
	// The index of this item in its parent's children array
	index?: number;
	// This item's parent item
	parent?: NavItem;
	// Text to print as menu item text
	text?: string;
}

/**
 * @desc Controller for the local nav menu, which facilitates local Wikia
 * navigation. The view for this controller is rendered in SideNavView.
 */
App.LocalNavMenuController = Em.ObjectController.extend({
	init: function (): void {
		/**
		 * Note: this means that the model is stored directly
		 * in the Wikia object. We may wish to actually copy it over,
		 * or removed the reference in the Wikia object to it so that
		 * this controller has exclusive access to it.
		 */
		this.set('model', Wikia.wiki.navData);
		this.set('menuRoot', {children: this.get('model.navigation.wiki')});
		this.set('currentMenuItem', this.get('menuRoot'));
		this.set('parentItem', null);
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
		var topLevel = this.get('menuRoot'),
			children: Array<NavItem> = topLevel.children,
			i: number,
			len: number = children.length;
		for (i = 0; i < len; i++) {
			this.injectParentPointersAndIndicesHelper(topLevel, children[i], i);
		}
	},

	/**
	 * Recursive helper for the above function.
	 * @param parent The parent of curr
	 * @param curr The object to set the parent of, and then recursively
	 * @param index The index of this item in its parent's children array, because
	 * 	we need it to link to the correct child
	 * set the parent of all its children, depth-first.
	 */
	injectParentPointersAndIndicesHelper: function (parent: NavItem, curr: NavItem, index: number): void {
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

	actions: {
		goBack: function (): void {
			this.set('currentMenuItem', this.get('parentItem'));
			// We've made it back to the root of the menu
			if (this.get('currentMenuItem') === this.get('menuRoot')) {
				this.set('parentItem', null);
			} else {
				this.set('parentItem', this.get('currentMenuItem').parent);
			}
		},

		/**
		 * @desc Action that changes `currentMenuItem` based on the index of
		 * `currentMenuItem`'s children
		 * @param index The index of the item to change to
		 */
		changeMenuItem: function (index: number): void {
			var curr: NavItem = this.get('currentMenuItem');
			this.set('currentMenuItem', curr.children[index]);
			this.set('parentItem', curr);
		}
	}
});
