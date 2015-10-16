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
	 * @param {Object} controller controller to set
	 * @param {CuratedContentEditorItemModel} model CuratedContentEditorItemModel
	 * @param {EmberState.Transition} transition Ember transition
	 * @returns {void}
	 */
	setupController(controller, model, transition) {
		this._super(controller, model, transition);
		controller.set('alreadyUsedLabels', App.CuratedContentEditorModel.getAlreadyUsedLabels(
			this.modelFor('curatedContentEditor').get('curated'))
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
			this.transitionTo('curatedContentEditor.index');
		},

		/**
		 * @param {CuratedContentEditorItemModel} newSection section to add
		 * @returns {void}
		 */
		done(newSection) {
			this.transitionTo('curatedContentEditor.section', newSection, {
				queryParams: {
					isNewSection: true
				}
			});
		},

		/**
		 * Delete section
		 * @returns {void}
		 */
		deleteItem() {
			this.send('goBack');
		}
	}
});
