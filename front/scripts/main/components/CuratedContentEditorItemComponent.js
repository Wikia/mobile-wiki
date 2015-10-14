App.CuratedContentEditorItemComponent = Em.Component.extend(App.CuratedContentEditorLayoutMixin, {
	editorLayout: 'curated-content-editor-item-form',

	actions: {
		/**
		 * @returns {void}
		 */
		goBack() {
			this.sendAction('goBack');
		},

		/**
		 * @param {CuratedContentEditorModel} model model to save
		 * @returns {void}
		 */
		done(model) {
			this.sendAction('done', model);
		},

		/**
		 * @returns {void}
		 */
		deleteItem() {
			this.sendAction('deleteItem');
		},

		/**
		 * @param {String} newLayoutName new layout name
		 * @returns {void}
		 */
		changeLayout(newLayoutName) {
			this.set('editorLayout', newLayoutName);
		}
	}
});
