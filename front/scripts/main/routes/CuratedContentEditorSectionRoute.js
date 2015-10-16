App.CuratedContentEditorSectionRoute = Em.Route.extend({
	/**
	 * @param {CuratedContentEditorItemModel} model model to serialize
	 * @returns {Object} serialized label
	 */
	serialize(model) {
		return {
			section: model.label
		};
	},

	/**
	 * @param {Object} params params to decode
	 * @returns {CuratedContentEditorItemModel} section section
	 */
	model(params) {
		const section = decodeURIComponent(params.section),
			curatedSections = this.modelFor('curatedContentEditor').curated;

		return App.CuratedContentEditorModel.getItem(curatedSections, section);
	},

	/**
	 * @param {Object} controller controller to set
	 * @param {CuratedContentEditorItemModel} model CuratedContentEditorItemModel
	 * @param {EmberState.Transition} transition Ember transition
	 * @returns {void}
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
		 * @returns {void}
		 */
		goBack() {
			this.transitionTo('curatedContentEditor.index');
		},

		/**
		 * @returns {void}
		 */
		addItem() {
			this.transitionTo('curatedContentEditor.section.addItem');
		},

		/**
		 * @param {CuratedContentEditorItemModel} item item to edit
		 * @returns {void}
		 */
		editItem(item) {
			this.transitionTo('curatedContentEditor.section.editItem', encodeURIComponent(item.label));
		},

		/**
		 * @returns {void}
		 */
		editSection() {
			this.transitionTo('curatedContentEditor.section.edit');
		},


		/**
		 * @param {CuratedContentEditorItemModel} newSection section to save
		 * @returns {void}
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
