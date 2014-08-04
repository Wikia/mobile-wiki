/// <reference path="../app.ts" />
'use strict';

App.LocalNavMenuController = Em.ObjectController.extend({
	needs: ['application'],
	init: function () {
		/**
		 * Note: this means that the model is stored directly
		 * in the Wikia object. We may wish to actually copy it over,
		 * or removed the reference in the Wikia object to it so that
		 * this controller has exclusive access to it.
		 */
		this.set('model', Wikia.wiki.navData);
		this.set('menuRoot', { children: this.get('model.navigation.wiki') });
		this.set('currentMenuItem', this.get('menuRoot'));
		this.set('parentItem', null);
		this.injectParentPointersAndIndices();
	},

	/**
	 * @desc function which recursively sets the 'parent' property
	 * of all of the items in the navData tree. It also sets the index
	 * of each item in its parent's `children` array, necessary because
	 * of how finicky Ember slightly customized version of Handlebars is.
	 */
	injectParentPointersAndIndices: function () {
		// debugger;
		var topLevel = this.get('menuRoot'),
			children = topLevel.children;
		for (var i = 0, len = children.length; i < len; i++) {
			this.injectParentPointersAndIndicesHelper(topLevel, children[i], i);
		}
	},

	/**
	 * Recursive helper for the above function.
	 * @param parent The parent of curr
	 * @param curr The object to set the parent of, and then recursively
	 * set the parent of all its children, depth-first.
	 */
	injectParentPointersAndIndicesHelper: function (parent, curr, index) {
		var i,
			len;
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
		goBack: function () {
			// debugger;
			// TODO doesn't traverse up the tree correctly
			this.set('currentMenuItem', this.get('parentItem'));
			// We've made it back to the root of the menu
			if (this.get('currentMenuItem') == this.get('menuRoot')) {
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
		changeMenuItem: function (index) {
			var curr = this.get('currentMenuItem');
			this.set('currentMenuItem', curr.children[index]);
			this.set('parentItem', curr);
		}
	}
});
