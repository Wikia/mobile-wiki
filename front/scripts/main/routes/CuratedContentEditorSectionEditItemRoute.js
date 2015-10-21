App.CuratedContentEditorSectionEditItemRoute = Em.Route.extend({
	/**
	 * @param {Object} params
	 * @returns {CuratedContentEditorItemModel} item
	 */
	model(params) {
		const item = decodeURIComponent(params.item),
			sectionModel = this.modelFor('curatedContentEditor.section');

		return App.CuratedContentEditorModel.getItem(sectionModel, item);
	},

	/**
	 * @param {Object} controller
	 * @param {CuratedContentEditorItemModel} model
	 * @param {EmberState.Transition} transition
	 * @returns {undefined}
	 */
	setupController(controller, model, transition) {
		const sectionController = this.controllerFor('curatedContentEditor.section'),
			alreadyUsedLabels = sectionController.get('alreadyUsedItemsLabels').filter(
				(item) => item !== model.label
			);

		this._super(controller, model, transition);
		controller.setProperties({
			alreadyUsedLabels,
			originalItemLabel: model.label
		});
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
				originalItemLabel = this.get('controller.originalItemLabel'),
				sectionController = this.controllerFor('curatedContentEditor.section'),
				alreadyUsedLabels = sectionController.get('alreadyUsedItemsLabels'),
				itemIndex = alreadyUsedLabels.indexOf(originalItemLabel);

			alreadyUsedLabels[itemIndex] = newItem.label;
			sectionController.set('alreadyUsedItemsLabels', alreadyUsedLabels);

			App.CuratedContentEditorModel.updateItem(sectionModel, newItem, originalItemLabel);
			this.transitionTo('curatedContentEditor.section.index');
		},

		/**
		 * @returns {undefined}
		 */
		deleteItem() {
			const sectionModel = this.modelFor('curatedContentEditor.section'),
				controller = this.controllerFor('curatedContentEditor.section.editItem'),
				originalItemLabel = controller.get('originalItemLabel');

			App.CuratedContentEditorModel.deleteItem(sectionModel, originalItemLabel);
			this.transitionTo('curatedContentEditor.section.index');
		}
	}
});
