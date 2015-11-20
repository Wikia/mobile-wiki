const authUtils = require('../../lib/AuthUtils'),
	caching = require('../../lib/Caching'),
	localSettings = require('../../../config/localSettings'),
	authView = require('./authView'),
	deepExtend = require('deep-extend'),
	url = require('url');

/**
 * @typedef {Object} JoinViewContext
 * @extends {AuthViewContext}
 * @property {string} loginRoute
 * @property {string} signupHref
 * @property {string} heliosFacebookURL
 * @property {number} [facebookAppId]
 */

/**
 * @param {Hapi.Request} request
 * @param {*} reply
 * @returns {Hapi.Response}
 */
exports.get = function (request, reply) {
	const context = deepExtend(
		authView.getDefaultContext(request),
		{
			title: 'auth:join.title',
			signinRoute: authUtils.getSignInUrl(request),
			hideHeader: true,
			hideFooter: true,
			signupHref: authUtils.getRegisterUrl(request),
			bodyClasses: 'splash join-page',
			pageType: 'join-page',
			heliosFacebookURL: authUtils.getHeliosUrl('/facebook/token'),
			pageParams: {
				facebookAppId: localSettings.facebook.appId
			}
		}
	);

	let response;

	if (request.auth.isAuthenticated) {
		return authView.onAuthenticatedRequestReply(request, reply, context);
	}

	if (authView.getViewType(request) === authView.VIEW_TYPE_DESKTOP) {
		request.url.pathname = '/register';
		response = reply.redirect(url.format(request.url));
		caching.disableCache(response);
		return response;
	}

	return authView.view('join-page', context, request, reply);
};
