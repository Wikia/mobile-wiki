App.CuratedContentEditorSectionEditRoute = Em.Route.extend({
	/**
	 * @returns {CuratedContentEditorItemModel} model for section
	 */
	model() {
		return $.extend(true, {}, this.modelFor('curatedContentEditor.section'));
	},

	/**
	 * @param {Object} controller controller to set
	 * @param {CuratedContentEditorItemModel} model CuratedContentEditorItemModel
	 * @param {EmberState.Transition} transition Ember transition
	 * @returns {void}
	 */
	setupController(controller, model, transition) {
		this._super(controller, model, transition);

		controller.set('alreadyUsedLabels', App.CuratedContentEditorModel.getAlreadyUsedLabels(
			this.modelFor('curatedContentEditor').get('curated'), model.label)
		);
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
			const sectionModel = this.modelFor('curatedContentEditor.section');

			this.transitionTo('curatedContentEditor.section', encodeURIComponent(sectionModel.label));
		},

		/**
		 * @param {CuratedContentEditorItemModel} newSection section to go
		 * @returns {void}
		 */
		done(newSection) {
			const sectionModel = this.modelFor('curatedContentEditor.section');

			Em.setProperties(sectionModel, newSection);
			this.transitionTo('curatedContentEditor.section.index');
		},

		/**
		 * Delete section
		 * @returns {void}
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
