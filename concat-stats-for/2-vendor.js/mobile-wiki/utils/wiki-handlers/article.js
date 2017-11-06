define('mobile-wiki/utils/wiki-handlers/article', ['exports', 'mobile-wiki/utils/mediawiki-fetch', 'mobile-wiki/utils/url'], function (exports, _mediawikiFetch, _url) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});


	function addOoyalaAssets(route) {
		if (!route.get('fastboot.isFastBoot')) {
			return;
		}

		// Render components into FastBoot's HTML, outside of the Ember app so they're not touched when Ember starts
		var applicationInstance = Ember.getOwner(route);
		var document = applicationInstance.lookup('service:-document');
		var articleVideoScripts = applicationInstance.lookup('component:fastboot-only/article-video-scripts');
		var articleVideoStyles = applicationInstance.lookup('component:fastboot-only/article-video-styles');
		articleVideoScripts.appendTo(document.body);
		articleVideoStyles.appendTo(document.head);
	}

	/**
  * @param {Ember.Route} route
  * @param {Ember.Object} model
  * @returns {void}
  */
	function afterModel(route, model) {
		// Reset query parameters
		model.set('commentsPage', null);

		route.set('redirectEmptyTarget', model.get('redirectEmptyTarget'));

		// Include Ooyala assets if there is no portable infobox and featured video is attached
		if (!model.get('hasPortableInfobox') && model.get('featuredVideo')) {
			addOoyalaAssets(route);
		}
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
  */
	function sendLyricsPageView(_ref) {
		var model = _ref.model,
		    host = _ref.host;

		(0, _mediawikiFetch.default)((0, _url.buildUrl)({
			host: host,
			path: '/wikia.php',
			query: {
				controller: 'LyricFind',
				method: 'track',
				title: model.get('title'),
				amgid: 0,
				gracenoteid: 0,
				rand: ('' + Math.random()).substr(2, 8)
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
	function shouldSendLyricFindRequest(_ref2) {
		var model = _ref2.model,
		    wikiId = _ref2.wikiId,
		    fastboot = _ref2.fastboot;

		var lyricWikiId = 43339;

		return wikiId === lyricWikiId && !model.get('isMainPage') && !fastboot.get('isFastBoot');
	}

	/**
  * Hook triggered on transition.then() in Route::afterModel()
  *
  * @param {Ember.Object} model
  * @param {number} wikiId
  * @param {String} host
  * @param {{get}} fastboot
  */
	function afterTransition(_ref3) {
		var model = _ref3.model,
		    wikiId = _ref3.wikiId,
		    host = _ref3.host,
		    fastboot = _ref3.fastboot;

		if (shouldSendLyricFindRequest({ model: model, wikiId: wikiId, fastboot: fastboot })) {
			sendLyricsPageView({ model: model, host: host });
		}
	}

	/**
  * Export Article handler
  */
	exports.default = {
		// template's and controller's name
		controllerName: 'article',
		viewName: 'article',
		afterModel: afterModel,
		afterTransition: afterTransition
	};
});