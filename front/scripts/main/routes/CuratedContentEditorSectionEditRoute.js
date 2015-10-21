App.CuratedContentEditorSectionEditRoute = Em.Route.extend({
	/**
	 * @returns {CuratedContentEditorItemModel} model
	 */
	model() {
		return $.extend(true, {}, this.modelFor('curatedContentEditor.section'));
	},

	/**
	 * @param {Object} controller
	 * @param {CuratedContentEditorItemModel} model
	 * @param {EmberState.Transition} transition
	 * @returns {undefined}
	 */
	setupController(controller, model, transition) {
		this._super(controller, model, transition);

		controller.set('alreadyUsedLabels', App.CuratedContentEditorModel.getAlreadyUsedLabels(
			this.modelFor('curatedContentEditor').get('curated'), model.label)
		);
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
			const sectionModel = this.modelFor('curatedContentEditor.section');

			this.transitionTo('curatedContentEditor.section', encodeURIComponent(sectionModel.label));
		},

		/**
		 * @param {CuratedContentEditorItemModel} newSection
		 * @returns {undefined}
		 */
		done(newSection) {
			const sectionModel = this.modelFor('curatedContentEditor.section');

			Em.setProperties(sectionModel, newSection);
			this.transitionTo('curatedContentEditor.section.index');
		},

		/**
		 * @returns {undefined}
		 */
		deleteItem() {
			const curatedSections = this.modelFor('curatedContentEditor').curated,
				controller = this.controllerFor('curatedContentEditor.section'),
				originalSectionLabel = controller.get('originalSectionLabel');

			App.CuratedContentEditorModel.deleteItem(curatedSections, originalSectionLabel);
			this.transitionTo('curatedContentEditor.index');
		}
	}
});
