import fetch from '../mediawiki-fetch';

/**
 * @param {Ember.Route} route
 * @param {Ember.Object} model
 * @returns {void}
 */
function afterModel(route, model) {
	// Reset query parameters
	model.set('commentsPage', null);

	route.set('redirectEmptyTarget', model.get('redirectEmptyTarget'));
}

/**
 * This function, along with shouldSendLyricFindRequest, tracks page view only on articles on Lyrics Wiki (id: 43339).
 * Notice that params amgid and gracenoteid are set to 0, those params are not important,
 * but to be consistent with Oasis we send them
 *
 * https://github.com/Wikia/app/blob/dev/extensions/3rdparty/LyricWiki/LyricFind/js/modules/LyricFind.Tracker.js
 *
 * @param {Ember.Object} model
 * @param {String} host
 * @param {Ember.Service} buildUrl
 */
function sendLyricsPageView({model, host, buildUrl}) {
	fetch(buildUrl.build({
		host,
		path: '/wikia.php',
		query: {
			controller: 'LyricFind',
			method: 'track',
			title: model.get('title'),
			amgid: 0,
			gracenoteid: 0,
			rand: (`${Math.random()}`).substr(2, 8)
		}
	}));
}

/**
 * @param {Ember.Object} model
 * @param {number} wikiId
 * @param {{get}} fastboot
 *
 * @returns {boolean}
 */
function shouldSendLyricFindRequest({model, wikiId, fastboot}) {
	const lyricWikiId = 43339;

	return wikiId === lyricWikiId && !model.get('isMainPage') && !fastboot.get('isFastBoot');
}

/**
 * Hook triggered on transition.then() in Route::afterModel()
 *
 * @param {Ember.Object} model
 * @param {number} wikiId
 * @param {String} host
 * @param {{get}} fastboot
 * @param {Ember.Service} buildUrl
 */
function afterTransition({model, wikiId, host, fastboot, buildUrl}) {
	if (shouldSendLyricFindRequest({model, wikiId, fastboot})) {
		sendLyricsPageView({model, host, buildUrl});
	}
}

/**
 * Export Article handler
 */
export default {
	// template's and controller's name
	controllerName: 'article',
	viewName: 'article',
	afterModel,
	afterTransition
};
