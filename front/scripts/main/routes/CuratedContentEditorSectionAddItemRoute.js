App.CuratedContentEditorSectionAddItemRoute = Em.Route.extend({
	/**
	 * @returns {CuratedContentEditorItemModel} new item
	 */
	model() {
		return App.CuratedContentEditorItemModel.createNew();
	},

	/**
	 * @param {Object} controller
	 * @param {CuratedContentEditorItemModel} model
	 * @param {EmberState.Transition} transition
	 * @returns {undefined}
	 */
	setupController(controller, model, transition) {
		const sectionController = this.controllerFor('curatedContentEditor.section'),
			alreadyUsedLabels = sectionController.get('alreadyUsedItemsLabels');

		this._super(controller, model, transition);
		controller.set('alreadyUsedLabels', alreadyUsedLabels);
	},

	/**
	 * @returns {undefined}
	 */
	renderTemplate() {
		this.render('curated-content-editor-item');
	},

	actions: {
		/**
		 * @returns {undefined}
		 */
		goBack() {
			this.transitionTo('curatedContentEditor.section.index');
		},

		/**
		 * @param {CuratedContentEditorItemModel} newItem
		 * @returns {undefined}
		 */
		done(newItem) {
			const sectionModel = this.modelFor('curatedContentEditor.section'),
				sectionController = this.controllerFor('curatedContentEditor.section'),
				alreadyUsedLabels = sectionController.get('alreadyUsedItemsLabels');

			sectionController.set('alreadyUsedItemsLabels', alreadyUsedLabels.concat(newItem.label));
			App.CuratedContentEditorModel.addItem(sectionModel, newItem);
			this.transitionTo('curatedContentEditor.section.index');
		},

		/**
		 * @returns {undefined}
		 */
		deleteItem() {
			this.send('goBack');
		}
	}
});
