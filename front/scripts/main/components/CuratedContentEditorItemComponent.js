App.CuratedContentEditorItemComponent = Em.Component.extend(
	App.CuratedContentEditorLayoutMixin,
	{
		editorLayout: 'curated-content-editor-item-form',

		actions: {
			/**
			 * @returns {undefined}
			 */
			goBack() {
				this.sendAction('goBack');
			},

			/**
			 * @param {CuratedContentEditorModel} model
			 * @returns {undefined}
			 */
			done(model) {
				this.sendAction('done', model);
			},

			/**
			 * @returns {undefined}
			 */
			deleteItem() {
				this.sendAction('deleteItem');
			},

			/**
			 * @param {string} newLayoutName
			 * @returns {undefined}
			 */
			changeLayout(newLayoutName) {
				this.set('editorLayout', newLayoutName);
			}
		}
	}
);
