App.CuratedContentEditorBlockComponent = Em.Component.extend(App.CuratedContentEditorSortableItemsMixin, {
	tagName: 'section',
	classNames: ['curated-content-editor-block'],

	isHelpVisible: false,
	persistentSort: true,

	actions: {
		/**
		 * @returns {void}
		 */
		addItem() {
			this.sendAction('addItem', this.get('block'));
		},

		/**
		 * @param {CuratedContentEditorItemModel} item item to edit
		 * @returns {void}
		 */
		editItem(item) {
			this.sendAction('editItem', item, this.get('block'));
		},

		/**
		 * @param {CuratedContentEditorItemModel} item section to open
		 * @returns {void}
		 */
		openSection(item) {
			this.sendAction('openSection', item);
		},

		/**
		 * @returns {void}
		 */
		showHelp() {
			this.trackClick('curated-content-editor', 'help-show');
			this.set('isHelpVisible', true);
		}
	}
});
