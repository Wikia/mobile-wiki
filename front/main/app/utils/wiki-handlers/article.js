import Ember from 'ember';
import request from 'ember-ajax/request';
import VisibilityStateManager from '../visibility-state-manager';

/**
 * This function tracks page view only on articles on Lyrics Wiki (id: 43339)
 *
 * @param {string} title
 */
function sendLyricsPageView(title) {
	if (Ember.get(Mercury, 'wiki.id') === 43339) {
		request(M.buildUrl({path: '/wikia.php'}), {
			data: {
				controller: 'LyricFind',
				method: 'track',
				title,
				amgid: 0,
				gracenoteid: 0,
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
 * @param {Ember.Route} route
 * @param {Ember.model} model
 * @returns {void}
 */
function afterModel(route, model) {
	const title = model.get('title');

	route.controllerFor('application').set('currentTitle', title);
	VisibilityStateManager.reset();

	// Reset query parameters
	model.set('commentsPage', null);

	route.set('redirectEmptyTarget', model.get('redirectEmptyTarget'));
	sendLyricsPageView(title);
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
