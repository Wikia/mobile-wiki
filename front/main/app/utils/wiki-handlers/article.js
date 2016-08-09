import Ember from 'ember';
import request from 'ember-ajax/request';
import VisibilityStateManager from '../visibility-state-manager';
import BaseHandler from './base-handler';

/**
 * @param {Ember.Route} route
 * @param {Ember.model} model
 * @returns {void}
 */
function afterModel(route, model) {
	route.controllerFor('application').set('currentTitle', model.get('title'));
	VisibilityStateManager.reset();

	// Reset query parameters
	model.set('commentsPage', null);

	route.set('redirectEmptyTarget', model.get('redirectEmptyTarget'));
}

/**
 * This function tracks page view only on articles on Lyrics Wiki (id: 43339)
 *
 * @param {Ember.Model} model
 */
function sendLyricsPageView(model) {
	if (Ember.get(Mercury, 'wiki.id') === 43339) {
		const amgId = parseInt($('#lyric').data('amg-id'), 10) || 0,
			gracenoteId = parseInt($('#gracenoteid').text(), 10) || 0;

		request(M.buildUrl({path: '/wikia.php'}), {
			data: {
				controller: 'LyricFind',
				method: 'track',
				title: model.title,
				amgid: amgId,
				gracenoteid: gracenoteId,
				rand: (`${Math.random()}`).substr(2, 8)
			},
			dataType: 'text'
		}).catch((error) => {
			/**
			 * MediaWiki returns 404 with header X-LyricFind-API-Code:106
			 * for success request but no lyrics
			 */
		});
	}
}

/**
 * Hook triggered on transition.then() in Route::afterModel()
 *
 * @param model
 */
function afterTransition(model) {
	sendLyricsPageView(model);
}

/**
 * Export Article handler
 */
export default Ember.$.extend({}, BaseHandler, {
	// template's and controller's name
	controllerName: 'article',
	viewName: 'article',
	afterModel,
	afterTransition
});
