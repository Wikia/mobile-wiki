App.CuratedContentEditorSectionAddItemRoute = Em.Route.extend({
	/**
	 * @returns {CuratedContentEditorItemModel} new item
	 */
	model() {
		return App.CuratedContentEditorItemModel.createNew();
	},

	/**
	 * @returns {void}
	 */
	renderTemplate() {
		this.render('curated-content-editor-item');
	},

	actions: {
		/**
		 * @returns {void}
		 */
		goBack() {
			this.transitionTo('curatedContentEditor.section.index');
		},

		/**
		 * @param {CuratedContentEditorItemModel} newItem
		 * @returns {void}
		 */
		done(newItem) {
			const sectionModel = this.modelFor('curatedContentEditor.section');

			App.CuratedContentEditorModel.addItem(sectionModel, newItem);
			this.transitionTo('curatedContentEditor.section.index');
		},

		/**
		 * @returns {void}
		 */
		deleteItem() {
			this.send('goBack');
		}
	}
});
