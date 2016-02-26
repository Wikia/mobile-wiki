import VisibilityStateManager from '../visibility-state-manager';

/**
 * @param {Ember.router} router
 * @param {Ember.model} model
 * @returns {void}
 */
function afterModel(router, model) {
	if (!Ember.isEmpty(model.exception)) {
		Ember.Logger.warn('Article model error:', model.exception);
	}

	router.controllerFor('application').set('currentTitle', model.get('title'));
	VisibilityStateManager.reset();

	// Reset query parameters
	model.set('commentsPage', null);

	router.set('redirectEmptyTarget', model.get('redirectEmptyTarget'));
}

/**
 * Export Article handler
 */
export default {
	// template's and controller's name
	controllerName: 'article',
	viewName: 'article',
	afterModel
};
