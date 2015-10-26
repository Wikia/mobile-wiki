App.CuratedContentEditorBlockComponent = Em.Component.extend(
	App.CuratedContentEditorSortableItemsMixin,
	{
		tagName: 'section',
		classNames: ['curated-content-editor-block'],

		isHelpVisible: false,
		persistentSort: true,

		actions: {
			/**
			 * @returns {undefined}
			 */
			addItem() {
				this.sendAction('addItem', this.get('block'));
			},

			/**
			 * @param {CuratedContentEditorItemModel} item
			 * @returns {undefined}
			 */
			editItem(item) {
				this.sendAction('editItem', item, this.get('block'));
			},

			/**
			 * @param {CuratedContentEditorItemModel} section
			 * @returns {undefined}
			 */
			openSection(section) {
				this.sendAction('openSection', section);
			},

			/**
			 * @returns {undefined}
			 */
			showHelp() {
				this.trackClick('curated-content-editor', 'help-show');
				this.set('isHelpVisible', true);
			}
		}
	}
);
