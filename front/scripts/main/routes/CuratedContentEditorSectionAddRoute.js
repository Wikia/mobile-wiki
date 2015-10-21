App.CuratedContentEditorSectionAddRoute = Em.Route.extend({
	/**
	 * @returns {CuratedContentEditorItemModel} new section
	 */
		model() {
		return App.CuratedContentEditorItemModel.createNew({
			node_type: 'section',
			items: []
		});
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
				this.modelFor('curatedContentEditor').get('curated'))
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
			this.transitionTo('curatedContentEditor.index');
		},

		/**
		 * @param {CuratedContentEditorItemModel} newSection
		 * @returns {undefined}
		 */
			done(newSection) {
			this.transitionTo('curatedContentEditor.section', newSection, {
				queryParams: {
					isNewSection: true
				}
			});
		},

		/**
		 * @returns {undefined}
		 */
			deleteItem() {
			this.send('goBack');
		}
	}
});
