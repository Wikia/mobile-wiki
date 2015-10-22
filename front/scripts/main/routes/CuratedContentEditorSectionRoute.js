App.CuratedContentEditorSectionRoute = Em.Route.extend({
	/**
	 * @param {CuratedContentEditorItemModel} model
	 * @returns {object} serialized label
	 */
	serialize(model) {
		return {
			section: model.label
		};
	},

	/**
	 * @param {Object} params
	 * @returns {CuratedContentEditorItemModel} section
	 */
	model(params) {
		const section = decodeURIComponent(params.section),
			curatedSections = this.modelFor('curatedContentEditor').curated;

		return App.CuratedContentEditorModel.getItem(curatedSections, section);
	},

	/**
	 * @param {Object} controller
	 * @param {CuratedContentEditorItemModel} model
	 * @param {EmberState.Transition} transition
	 * @returns {undefined}
	 */
	setupController(controller, model, transition) {
		const rootModel = this.modelFor('curatedContentEditor'),
			alreadyUsedItemsLabels = App.CuratedContentEditorModel.getAlreadyUsedNonFeaturedItemsLabels(rootModel);

		this._super(controller, model, transition);
		controller.setProperties({
			alreadyUsedItemsLabels,
			originalSectionLabel: model.label
		});
	},

	actions: {
		/**
		 * @returns {undefined}
		 */
		goBack() {
			this.transitionTo('curatedContentEditor.index');
		},

		/**
		 * @returns {undefined}
		 */
		addItem() {
			this.transitionTo('curatedContentEditor.section.addItem');
		},

		/**
		 * @param {CuratedContentEditorItemModel} item
		 * @returns {undefined}
		 */
		editItem(item) {
			this.transitionTo('curatedContentEditor.section.editItem', encodeURIComponent(item.label));
		},

		/**
		 * @returns {undefined}
		 */
		editSection() {
			this.transitionTo('curatedContentEditor.section.edit');
		},


		/**
		 * @param {CuratedContentEditorItemModel} newSection
		 * @returns {undefined}
		 */
		done(newSection) {
			const curatedSections = this.modelFor('curatedContentEditor').curated,
				controller = this.controllerFor('curatedContentEditor.section'),
				originalSectionLabel = controller.get('originalSectionLabel'),
				isNewSection = controller.get('isNewSection');

			if (isNewSection) {
				App.CuratedContentEditorModel.addItem(curatedSections, newSection);
				controller.set('isNewSection', null);
			} else {
				App.CuratedContentEditorModel.updateItem(curatedSections, newSection, originalSectionLabel);
			}

			this.transitionTo('curatedContentEditor.index');
		}
	}
});
