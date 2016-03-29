import Ember from 'ember';

export default Ember.Component.extend({
	localNavigationVisible: true,
	localNavContent: Ember.computed(function () {
		return this.injectParentPointersAndIndices({
			children: Ember.get(Mercury, 'wiki.navigation2016.localNav')
		});
	}),

	actions: {
		/**
		 * @param {boolean} enable
		 * @returns {void}
		 */
		toggleSearchMode(enable) {
			this.set('localNavigationVisible', !enable);
		},

		updateContent(newLocalNavContent) {
			this.set('localNavContent', newLocalNavContent);
			this.scrollToTop();
		},

		goBack() {
			const currentContent = this.get('localNavContent');

			if (Ember.get(currentContent, 'parent')) {
				this.set('localNavContent', currentContent.parent);
			} else {
				this.sendAction('replaceNavigationContent', 'root');
			}

			this.scrollToTop();
		},
	},

	scrollToTop() {
		this.element.scrollTop = 0;
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
	 * @param {NavItem} current - The object to set the parent of, and then recursively
	 * set the parent of all its children, depth-first
	 * @param {number} index - The index of this item in its parent's children array, because
	 * we need it to link to the correct child
	 * @returns {void}
	 */
	injectParentPointersAndIndicesHelper(parent, current, index) {
		current.parent = parent;
		current.index = index;

		if (!current.hasOwnProperty('children')) {
			return;
		}

		for (let i = 0, len = current.children.length; i < len; i++) {
			this.injectParentPointersAndIndicesHelper(current, current.children[i], i);
		}
	}
});
