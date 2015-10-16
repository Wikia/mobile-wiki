App.CuratedContentEditorSectionAddItemRoute = Em.Route.extend({
	/**
	 * @returns {CuratedContentEditorItemModel} new item
	 */
	model() {
		return App.CuratedContentEditorItemModel.createNew();
	},

	/**
	 * @param {Object} controller controller to set
	 * @param {CuratedContentEditorItemModel} model CuratedContentEditorItemModel
	 * @param {EmberState.Transition} transition Ember transition
	 * @returns {void}
	 */
	setupController(controller, model, transition) {
		const sectionController = this.controllerFor('curatedContentEditor.section'),
			alreadyUsedLabels = sectionController.get('alreadyUsedItemsLabels');

		this._super(controller, model, transition);
		controller.set('alreadyUsedLabels', alreadyUsedLabels);
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
		 * @param {CuratedContentEditorItemModel} newItem item to add
		 * @returns {void}
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
		 * @returns {void}
		 */
		deleteItem() {
			this.send('goBack');
		}
	}
});
